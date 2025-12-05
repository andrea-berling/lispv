addi i10, i0, 0
addi i11, i0, 1
addi i1, i0, 40 # i1 = 40
loop:
addi i1, i1, -4 # i -= 4
add i12, i0, i11
add i11, i11, i10
add i10, i0, i12
sw i10, 0xff(i1) # 0xff is the base address of the array, of size 4B and length 10
bne i1, i0, loop # while i1 > 0
