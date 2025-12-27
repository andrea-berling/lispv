_start:
    jal zero, end-triangular
triangular:
    addi sp, sp, -8
    sw ra, 4(sp)
    sw a1, 0(sp)
    add t1, zero, a1
        # (if a (+ a (triangular (+ a (- 1)))) 0)
            add a1, zero, t1
            add a0, zero, t1
        bne a0, zero, if-true-1
        jal zero, if-false-1
        # (+ a (triangular (+ a (- 1))))
if-true-1:
            addi sp, sp, -8
            # op (+ a (triangular (+ a (- 1))))
                addi sp, sp, -4
                # op (triangular (+ a (- 1)))
                # a: nested call
                    addi sp, sp, -8
                    # op (+ a (- 1))
                        # op (- 1)
                          addi a1, zero, 1
                          addi a0, zero, 1
                        jalr ra, minus-1(zero)
                        add a2, zero, a0
                    sw a2, 4(sp)
                      add a1, zero, t1
                      add a0, zero, t1
                    sw a1, 0(sp)
                    lw a1, 0(sp)
                    lw a2, 4(sp)
                    jalr ra, plus-2(zero)
                    add a1, zero, a0
                    addi sp, sp, 8
                sw a1, 0(sp)
                lw t1, 0(sp)
                jalr ra, triangular(zero) # recursive call
                lw t1, 0(sp) 
                add a2, zero, a0
                addi sp, sp, 4
            sw a2, 4(sp)
              add a1, zero, t1
              add a0, zero, t1
            sw a1, 0(sp)
            lw a1, 0(sp)
            lw a2, 4(sp)
            jalr ra, plus-2(zero)
            add a1, zero, a0
            addi sp, sp, 8
        jal zero, if-end-1
        # 0
if-false-1:
            addi a1, zero, 0
            addi a0, zero, 0
if-end-1:
    lw ra, 4(sp)
    lw a1, 0(sp)
    addi sp, sp, 8
    jal ra, 0
end-triangular:
    addi a0, zero, 1
    # op (triangular 5)
    # a: 5
      addi a1, zero, 5
      addi a0, zero, 5
    jalr ra, triangular(zero)
    add a1, zero, a0

# asm: 10
# interpreter: 15
