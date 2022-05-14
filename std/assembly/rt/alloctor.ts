import { BLOCK, BLOCK_OVERHEAD, DEBUG, TRACE } from "./common";

@inline const FREE_BLOCK_SIZE = offsetof<Block>();
@inline const MIN_BLOCK_SIZE = 32;

@inline const ALLOCATED = 1;
@inline const FREE = 0;

// statistic
@global export let totalblock: u32 = 1;
@global export let usedblock: u32 = 0;

@unmanaged
export class Block extends BLOCK {
  free: Block | null;
  get next(): Block {
    return changetype<Block>(changetype<usize>(this) + (this.mmInfo & ~3));
  }
  static getBlock(ptr: usize): Block {
    return changetype<Block>(ptr - BLOCK_OVERHEAD);
  }

  getSize(): usize {
    return this.mmInfo & ~3;
  }
  setSize(size: usize): void {
    this.mmInfo = (size & ~3) | (this.mmInfo & 3);
  }
  getAllocated(): usize {
    return this.mmInfo & 3;
  }
  /**
   * allocated is 1, free is 0
   */
  setAllocated(allocated: usize): void {
    this.mmInfo = (this.mmInfo & ~3) | allocated;
  }

  split(prev: Block, size: usize): Block {
    const thisSize = this.getSize();
    if (DEBUG) assert(thisSize >= size);
    if (thisSize >= size + MIN_BLOCK_SIZE) {
      totalblock++;
      const nextBlock = changetype<Block>(changetype<usize>(this) + size);
      if (TRACE) trace("split", 2, changetype<usize>(this), changetype<usize>(nextBlock));
      nextBlock.free = this.free; // inherit
      prev.free = nextBlock; // redirect

      this.setAllocated(ALLOCATED);
      nextBlock.setAllocated(FREE);

      nextBlock.setSize(thisSize - size);
      this.setSize(size);
      return nextBlock;
    } else {
      const nextBlock = changetype<Block>(this.free);
      prev.free = this.free;
      this.setAllocated(ALLOCATED);
      return nextBlock;
    }
  }

  merge(): void {
    if (TRACE)
      trace("merge", 4, changetype<usize>(this), this.getSize(), changetype<usize>(this.next), this.next.getSize());
    totalblock--;
    const next = this.next;
    this.free = next.free;
    const newSize = this.getSize() + next.getSize();
    this.setSize(newSize);
  }
}

var freeRoot = changetype<Block>(ceilSize(__heap_base));
freeRoot.free = null;
freeRoot.setSize(((<usize>memory.size()) << 16) - ceilSize(__heap_base));
freeRoot.setAllocated(FREE);

// @ts-ignore: decorator
@global @unsafe
export function __alloc(size: usize): usize {
  if (TRACE) trace("__alloc", 1, size);
  usedblock++;
  const toalSize = max<usize>(MIN_BLOCK_SIZE, ceilSize(size + BLOCK_OVERHEAD));
  let prev = freeRoot;
  let curr = freeRoot;
  while (curr.getSize() < toalSize) {
    const nextFree = curr.free;
    if (nextFree == null) {
      growMemory(curr, toalSize);
    }
    prev = curr;
    curr = curr.free!;
  }
  const nextBlock = curr.split(prev, toalSize);
  if (DEBUG) assert(nextBlock.getAllocated() == FREE);
  if (curr == freeRoot) {
    // first is allocated
    freeRoot = nextBlock;
  }
  if (DEBUG) assert(curr.getAllocated() == ALLOCATED);
  if (TRACE) trace("alloc", 1, changetype<usize>(curr));
  return changetype<usize>(curr) + BLOCK_OVERHEAD;
}

// @ts-ignore: decorator
@global @unsafe
export function __realloc(ptr: usize, size: usize): usize {
  if (TRACE) trace("__realloc");
  const oldBlock = Block.getBlock(ptr);
  const oldSize = oldBlock.getSize() - BLOCK_OVERHEAD;
  __free(ptr);
  const newPtr = __alloc(size);
  memory.copy(newPtr, ptr, min(oldSize, size));
  return newPtr;
}

// @ts-ignore: decorator
@global @unsafe
export function __free(ptr: usize): void {
  if (ptr < __heap_base) return;
  if (TRACE) trace("__free", 1, ptr);
  usedblock--;
  let block = Block.getBlock(ptr);
  if (DEBUG) assert(block.getAllocated() == ALLOCATED);
  const prevFree = visitFree(block); // prevFree may eq __heap_base
  const prev = visitAll(prevFree, block); // prev may eq block
  if (TRACE) trace("free", 3, changetype<usize>(block), changetype<usize>(prevFree), changetype<usize>(prev));
  block.setAllocated(FREE);

  // update free list
  if (prevFree.getAllocated() == FREE) {
    block.free = prevFree.free;
    prevFree.free = block;
  } else {
    // __heap_base
    block.free = freeRoot;
    freeRoot = block;
  }

  // update mminfo
  if (block.next.getAllocated() == FREE) {
    block.merge();
  }
  if (changetype<usize>(prev) != changetype<usize>(block) && prev.getAllocated() == FREE) {
    prev.merge();
    block = prev
  }
  if (DEBUG) assert(block.getAllocated() == FREE);
}

// @ts-ignore: decorator
@global @unsafe
export function __shrink(): usize {
  let prev = freeRoot;
  let curr = freeRoot;
  let next = freeRoot.free;
  while (next != null) {
    prev = curr;
    curr = next;
    next = next.free;
  }
  if (changetype<usize>(curr) != changetype<usize>(freeRoot) && changetype<i32>(curr.next) >= (memory.size() << 16)) {
    // last free block is the last block
    return changetype<usize>(curr) + FREE_BLOCK_SIZE;
  }
  return -1;
}

// #    # ###### #      #####  ###### #####
// #    # #      #      #    # #      #    #
// ###### #####  #      #    # #####  #    #
// #    # #      #      #####  #      #####
// #    # #      #      #      #      #   #
// #    # ###### ###### #      ###### #    #

function ceilSize(size: usize): usize {
  return (size + 3) & ~3;
}

function growMemory(lastFreeBlock: Block, needSize: usize): void {
  const oldSize = memory.size();
  const newBlock = changetype<Block>(oldSize << 16);
  lastFreeBlock.free = newBlock;
  const pagesNeeded = <i32>(((needSize + 0xffff) & ~0xffff) >>> 16);
  const pagesWanted = max(oldSize, pagesNeeded);
  if (memory.grow(pagesWanted) >= 0) {
    if (TRACE) trace("memory.grow", 1, pagesWanted);
    newBlock.setSize(pagesWanted << 16);
  } else if (memory.grow(pagesNeeded) >= 0) {
    if (TRACE) trace("memory.grow", 1, pagesNeeded);
    newBlock.setSize(pagesWanted << 16);
  } else {
    if (TRACE) trace("memory.grow failed");
    unreachable();
  }
  newBlock.setAllocated(FREE);
  newBlock.free = null;
}

function visitFree(block: Block): Block {
  let prev = changetype<Block>(ceilSize(__heap_base));
  let curr = freeRoot;
  let next = curr.free;
  if (TRACE) trace("visit free",3,changetype<usize>(curr),curr.getSize(),curr.getAllocated())
  while (changetype<usize>(curr) < changetype<usize>(block) && next != null) {
    if (DEBUG) assert(curr.getAllocated() == FREE);
    prev = curr;
    curr = next;
    next = curr.free;
    if (TRACE) trace("visit free",3,changetype<usize>(curr),curr.getSize(),curr.getAllocated())
  }
  return prev;
}
function visitAll(start: Block, block: Block): Block {
  let prev = start;
  if (TRACE) trace("visit all",3,changetype<usize>(start),start.getSize(),start.getAllocated())
  while (changetype<usize>(start) != changetype<usize>(block)) {
    prev = start;
    start = start.next;
    if (TRACE) trace("visit all",3,changetype<usize>(start),start.getSize(),start.getAllocated())
  }
  return prev;
}
