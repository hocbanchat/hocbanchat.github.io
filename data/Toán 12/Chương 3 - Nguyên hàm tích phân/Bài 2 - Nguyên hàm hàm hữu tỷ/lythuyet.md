### 1. Mẫu bậc nhất
Khi bậc của tử **lớn hơn** hoặc **bằng** bậc của mẫu $\xrightarrow{PP}$ Chia đa thức.

Xét $I = \int \frac{P(x)}{ax+b} dx$.

Phân tích: $\frac{P(x)}{ax+b} = g(x) + \frac{k}{ax+b}$.

Khi đó $I = \int \frac{P(x)}{ax+b} dx = \int g(x) dx + k \int \frac{1}{ax+b} dx$.

### 2. Mẫu có nhiều nghiệm đơn
Khi bậc của tử **nhỏ hơn** bậc của mẫu.

*   Xét $I = \int \frac{mx+n}{ax^2+bx+c} dx$.

**Trường hợp 1:** Mẫu số có hai nghiệm phân biệt.

Phân tích: $\frac{mx+n}{ax^2+bx+c} = \frac{mx+n}{a(x-x_1)(x-x_2)} = \frac{1}{a} \left( \frac{A}{x-x_1} + \frac{B}{x-x_2} \right)$
(Đồng nhất hệ số để tìm A, B).

$\longrightarrow I = \frac{1}{a} \left( A \ln|x-x_1| + B \ln|x-x_2| \right) + C$

**Trường hợp 2:** Mẫu số có nghiệm kép.

Phân tích: $\frac{mx+n}{ax^2+bx+c} = \frac{mx+n}{a(x-x_0)^2} = \frac{m(x-x_0)+p}{a(x-x_0)^2} = \frac{m}{a(x-x_0)} + \frac{p}{a(x-x_0)^2}$

**Trường hợp 3:** Mẫu số vô nghiệm.

Phân tích: $\frac{mx+n}{ax^2+bx+c} = \frac{k(2ax+b)}{ax^2+bx+c} + \frac{p}{a(x-x_0)^2 + q}$

Khi đó $I = \int \frac{k}{ax^2+bx+c} d(ax^2+bx+c) + \frac{p}{a} \int \frac{1}{(x-x_0)^2 + n^2} dx$

### 3. Bấm máy tính nguyên hàm hữu tỉ

Ta có: $\int \frac{mx+n}{ax^2+bx+c} dx = \frac{1}{a} \int \frac{mx+n}{(x-x_1)(x-x_2)} dx$
$= \frac{1}{a} \int \left( \frac{A}{x-x_1} + \frac{B}{x-x_2} \right) dx = \frac{1}{a} (A \ln|x-x_1| + B \ln|x-x_2|) + C$

**Tìm A, B nhanh bằng cách:**

**Bước 1:** Nhập vào máy tính biểu thức: $\frac{mx+n}{\frac{d}{dx}((x-x_1).(x-x_2))} \Bigg|_{x=X}$

**Bước 2:** Tìm A: `CALC` $x = x_1$.

**Bước 3:** Tìm B: `CALC` $x = x_2$.

---

**Ví dụ 1:** Tìm nguyên hàm của các hàm số sau:
a. $I_1 = \int \frac{x+1}{x-1} dx$
b. $I_2 = \int \frac{2x-4}{x+3} dx$
c. $I_3 = \int \frac{x^2+x+4}{x+3} dx$
d. $I_4 = \int \frac{x^3+2x^2-x}{x+1} dx$

**Lời giải**

a. $I_1 = \int \frac{x+1}{x-1} dx = \int \left( 1 + \frac{2}{x-1} \right) dx = \int 1 dx + 2 \int \frac{1}{x-1} dx = x + 2\ln|x-1| + C$.

b. $I_2 = \int \frac{2x-4}{x+3} dx = \int \left( 2 - \frac{10}{x+3} \right) dx = \int 2 dx - 10 \int \frac{1}{x+3} dx = 2x - 10\ln|x+3| + C$.

c. $I_3 = \int \frac{x^2+x+4}{x+3} dx = \int \left( x - 2 + \frac{10}{x+3} \right) dx = \int (x-2) dx + 10 \int \frac{1}{x+3} dx$
$= \frac{x^2}{2} - 2x + 10\ln|x+3| + C$

d. $I_4 = \int \frac{x^3+2x^2-x}{x+1} dx = \int \left( x^2 + x - 2 + \frac{2}{x+1} \right) dx = \int (x^2+x-2) dx + 2 \int \frac{1}{x+1} dx$
$= \frac{x^3}{3} + \frac{x^2}{2} - 2x + 2\ln|x+1| + C$.

---

**Ví dụ 2:** Tìm nguyên hàm của các hàm số sau:
a. $I_1 = \int \frac{3x-2}{(x-2)^2} dx$
b. $I_2 = \int \frac{1-5x}{(3x-4)^2} dx$
c. $I_3 = \int \frac{1}{x^2-2x-3} dx$
d. $I_4 = \int \frac{2x+3}{x^2-3x-4} dx$
e. $I_5 = \int \frac{2x+3}{2x^2-x-1} dx$
f. $I_6 = \int \frac{x^2-5x}{x^2-5x+6} dx$

**Lời giải**

a. $I_1 = \int \frac{3x-2}{(x-2)^2} dx = \int \left( \frac{3}{x-2} + \frac{4}{(x-2)^2} \right) dx = 3\ln|x-2| - \frac{4}{x-2} + C$.

b. Ta có: $\frac{1-5x}{(3x-4)^2} = \frac{A}{3x-4} + \frac{B}{(3x-4)^2}$
$\Rightarrow A(3x-4) + B = 1-5x \Rightarrow A = -\frac{5}{3}, B = -\frac{17}{3}$
$I_2 = A \int \frac{dx}{3x-4} + B \int \frac{dx}{(3x-4)^2} = -\frac{5}{9} \ln|3x-4| + \frac{17}{9} \frac{1}{3x-4} + C$.

c. Ta có $\frac{1}{x^2-2x-3} = \frac{1}{(x-3)(x+1)} = \frac{A}{x-3} + \frac{B}{x+1}$
$\Rightarrow A = \frac{1}{4}, B = -\frac{1}{4}$
$I_3 = \frac{1}{4} \ln|x-3| - \frac{1}{4} \ln|x+1| = \frac{1}{4} \ln \left| \frac{x-3}{x+1} \right| + C$.

d. Ta có: $\frac{2x+3}{x^2-3x-4} = \frac{2x+3}{(x-4)(x+1)} = \frac{A}{x-4} + \frac{B}{x+1}$
$\Rightarrow A+B=2, A-4B=3 \Rightarrow A = \frac{11}{5}, B = -\frac{1}{5}$.
$I_4 = \frac{11}{5} \ln|x-4| - \frac{1}{5} \ln|x+1| + C$.

e. Ta có: $\frac{2x+3}{2x^2-x-1} = \frac{2x+3}{(2x+1)(x-1)} = \frac{A}{2x+1} + \frac{B}{x-1}$
$\Rightarrow A+2B=2, -A+B=3 \Rightarrow A = -\frac{4}{3}, B = \frac{5}{3}$.
$I_5 = A \int \frac{dx}{2x+1} + B \int \frac{dx}{x-1} = -\frac{2}{3} \ln|2x+1| + \frac{5}{3} \ln|x-1| + C$.

f. Ta có: $\frac{x^2-5x}{x^2-5x+6} = 1 - \frac{6}{(x-2)(x-3)} = 1 + \frac{6}{x-2} - \frac{6}{x-3}$.
$I_6 = \int 1 dx + 6 \int \frac{dx}{x-2} - 6 \int \frac{dx}{x-3}$
$= x + 6\ln|x-2| - 6\ln|x-3| + C = x + 6\ln \left| \frac{x-2}{x-3} \right| + C$.

---

**Ví dụ 3:** Họ tất cả các nguyên hàm của hàm số $f(x) = \frac{x+2}{x-1}$ trên khoảng $(1; +\infty)$ là

A. $x+3\ln(x-1)+C$.
B. $x-3\ln(x-1)+C$.
C. $x-\frac{3}{(x-1)^2}+C$.
D. $x+\frac{3}{(x-1)^2}+C$.

**Lời giải**
**Chọn A**
Ta có $\int f(x) dx = \int \left( \frac{x+2}{x-1} \right) dx = \int \left( \frac{x-1+3}{x-1} \right) dx = \int \left( 1 + \frac{3}{x-1} \right) dx = x + 3\ln|x-1| + C$.
Mà $x \in (1; +\infty) \Rightarrow \int f(x) dx = 3 + 3\ln(x-1) + C$.

---

**Ví dụ 4:** Hàm số $f(x) = \frac{x^4}{x^2-1}$ có một nguyên hàm là $F(x)$ thỏa mãn $F(0) = -\frac{14}{3}$. Tính $e^{F(2)}$.

A. $e^{F(2)} = \frac{2\sqrt{3}}{3}$
B. $e^{F(2)} = \frac{\sqrt{3}}{2}$
C. $e^{F(2)} = \sqrt{3}$
D. $e^{F(2)} = \frac{\sqrt{3}}{3}$

**Lời giải**
**Chọn D.**
Chia đa thức: $\frac{x^4}{x^2-1} = x^2+1+\frac{1}{x^2-1} = x^2+1+\frac{1}{2} \left( \frac{1}{x-1} - \frac{1}{x+1} \right)$.
Suy ra $F(x) = \int f(x) dx = \frac{x^3}{3} + x + \frac{1}{2} \ln \left| \frac{x-1}{x+1} \right| + C$
Vì $F(0) = -\frac{14}{3}$ và $\ln \left| \frac{-1}{1} \right| = 0$ nên $C = -\frac{14}{3}$.
Do đó $F(2) = \frac{8}{3} + 2 + \frac{1}{2} \ln \frac{1}{3} - \frac{14}{3} = \frac{1}{2} \ln \frac{1}{3}$.
Suy ra $e^{F(2)} = e^{\frac{1}{2} \ln \frac{1}{3}} = \sqrt{\frac{1}{3}} = \frac{\sqrt{3}}{3}$.

---

**Ví dụ 5:** Hàm số $f(x) = \frac{1}{x^2-5x+6}$ có một nguyên hàm là $F(x)$ thỏa mãn $F(4) = 1 - \ln 2$.
Phương trình $F(x) = 1$ có nghiệm $x = \frac{a}{b}$, với $\frac{a}{b}$ là phân số tối giản. Tìm $a+b$.

A. $a+b=-2$
B. $a+b=5$
C. $a+b=7$
D. $a+b=9$

**Lời giải**
**Chọn C**
$f(x) = \frac{1}{x^2-5x+6} = \frac{1}{(x-2)(x-3)} = \frac{-1}{x-2} + \frac{1}{x-3}$.
Do đó $F(x) = \ln \left| \frac{x-3}{x-2} \right| + C$
Từ $F(4) = 1 - \ln 2$ (vì $\ln \left| \frac{1}{2} \right| = -\ln 2$) suy ra $C = 1$.
$F(x) = 1 : \ln \left| \frac{x-3}{x-2} \right| = 0 \Leftrightarrow \left| \frac{x-3}{x-2} \right| = 1 \Leftrightarrow x = \frac{5}{2}$.
Vậy $x = \frac{a}{b} = \frac{5}{2} \Rightarrow a+b=7$.

---

**Ví dụ 6:** Hàm số $f(x) = \frac{5x+11}{x^2+3x-10}$ có một nguyên hàm $F(x)$ thỏa mãn $F(3) = 3\ln 8$. Tìm $e^{F(-6)}$.

A. $e^{F(-6)} = 64$
B. $e^{F(-6)} = 512$
C. $e^{F(-6)} = 4096$
D. $e^{F(-6)} = 32768$

**Lời giải**
**Chọn C**
$f(x) = \frac{5x+11}{x^2+3x-10} = \frac{5x+11}{(x-2)(x+5)} = \frac{3}{x-2} + \frac{2}{x+5}$
Suy ra $F(x) = 3\ln|x-2| + 2\ln|x+5| + C$.
Từ $F(3) = 3\ln 8$ (vì $\ln|1| = 0$) suy ra $C = \ln 8$.
Do đó $F(-6) = 3\ln 8 + 2\ln 1 + \ln 8 = 4\ln 8 = \ln(8^4) = \ln 4096$.
Suy ra $e^{F(-6)} = 4096$.

---

**Ví dụ 7:** Tìm một nguyên hàm $F(x)$ của hàm số $f(x) = \frac{x^2}{x^2-7x+12}$ thỏa mãn $F(5) = 5$.

A. $F(x) = x + 16\ln|x-4| - 9\ln|x-3| - 9\ln 2$
B. $F(x) = x - 16\ln|x-4| + 9\ln|x-3| + 9\ln 2$
C. $F(x) = x + 16\ln|x-4| - 9\ln|x-3| + 9\ln 2$
D. $F(x) = x - 16\ln|x-4| + 9\ln|x-3| - 9\ln 2$

**Lời giải**
**Chọn C**
Phân tích $x^2-7x+12 = (x-3)(x-4)$, $x^2 = (x^2-7x+12) + (7x-12)$.
Do đó $f(x) = \frac{x^2}{x^2-7x+12} = 1 + \frac{7x-12}{(x-3)(x-4)} = 1 + \frac{A}{x-3} + \frac{B}{x-4}$
Mà $7x-12 = A(x-4) + B(x-3) \Rightarrow A = -9, B = 16$.
Vì thế $f(x) = 1 - \frac{9}{x-3} + \frac{16}{x-4}$
Lấy nguyên hàm: $F(x) = x - 9\ln|x-3| + 16\ln|x-4| + C$.
Điều kiện $F(5)=5$ cho $5 - 9\ln 2 + C = 5 \Rightarrow C = 9\ln 2$
Vậy $F(x) = x + 16\ln|x-4| - 9\ln|x-3| + 9\ln 2$.

---

**Ví dụ 8:** Tìm một nguyên hàm $F(x)$ của hàm số $f(x) = -\frac{x}{(x+1)^2}$, biết rằng đồ thị của hàm số $y=F(x)$ đi qua gốc tọa độ O.

A. $F(x) = \frac{x}{x+1} - \ln|x+1|$
B. $F(x) = \frac{1}{2} - \frac{x}{x+1} - \ln|x+1|$
C. $F(x) = -\frac{1}{x+1} + \ln|x+1| + 1$
D. $F(x) = \frac{x}{x+1} + \ln|x+1|$

**Lời giải**
**Chọn A**
$f(x) = -\frac{x}{(x+1)^2} = -\frac{1}{x+1} + \frac{1}{(x+1)^2}$
Do đó $F(x) = \int f(x) dx = -\ln|x+1| - \frac{1}{x+1} + C$
Đồ thị $y=F(x)$ đi qua gốc $O(0,0)$ nên $F(0)=0 \Rightarrow C=1$.
Suy ra $F(x) = -\ln|x+1| - \frac{1}{x+1} + 1 = \frac{x}{x+1} - \ln|x+1|$.

---

**Ví dụ 9:** Hàm số $f(x) = \frac{1}{x^2(x+1)}$ có một nguyên hàm là $F(x)$ thỏa mãn $F(1) = \ln 2$. Tính $F(-2)$.

A. $F(-2) = \frac{5}{2} - \ln \frac{1}{2}$
B. $F(-2) = \frac{5}{2} - \ln 2$
C. $F(-2) = \frac{3}{2} - \ln \frac{1}{2}$
D. $F(-2) = \frac{3}{2} - \ln 2$

**Lời giải**
**Chọn D**
Ta có: $f(x) = \frac{1}{x^2(x+1)} = \frac{A}{x} + \frac{B}{x^2} + \frac{C}{x+1}$.
Giải hệ $1 = (A+C)x^2 + (A+B)x + B$ cho $(A, B, C)$ được $A = -1, B = 1, C = 1$.
Vì vậy $f(x) = -\frac{1}{x} + \frac{1}{x^2} + \frac{1}{x+1}$
Một nguyên hàm là $F(x) = -\ln|x| - \frac{1}{x} + \ln|x+1| + C$
Điều kiện $F(1) = \ln 2$ cho $0 - 1 + \ln 2 + C = \ln 2 \Rightarrow C = 1$
Suy ra $F(-2) = -\ln 2 - \frac{1}{-2} + \ln 1 + 1 = -\ln 2 + \frac{1}{2} + 1 = \frac{3}{2} - \ln 2$.