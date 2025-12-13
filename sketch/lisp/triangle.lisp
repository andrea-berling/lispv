(defun f (a) (if (eq a 1) 1 (+ 1 ( f (+ a (- 1)) ) )))
(write (f 100))
