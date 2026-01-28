# BÀI 2: NGUYÊN HÀM CỦA HÀM HỮU TỶ

## I. KIẾN THỨC CẦN NHỚ

### 1. Mẫu bậc nhất
Khi bậc của tử **lớn hơn hoặc bằng** bậc của mẫu $\longrightarrow$ Chia đa thức.

Xét $I = \int \frac{P(x)}{ax+b} dx$.

Phân tích: $\frac{P(x)}{ax+b} = g(x) + \frac{k}{ax+b}$.

Khi đó:
$$I = \int \frac{P(x)}{ax+b} dx = \int g(x) dx + k \int \frac{1}{ax+b} dx$$

### 2. Mẫu có nhiều nghiệm đơn
Khi bậc của tử **nhỏ hơn** bậc của mẫu.

Xét $I = \int \frac{mx+n}{ax^2+bx+c} dx$.

*   **Trường hợp 1: Mẫu số có hai nghiệm phân biệt $x_1, x_2$.**
    Phân tích:
    $$\frac{mx+n}{ax^2+bx+c} = \frac{mx+n}{a(x-x_1)(x-x_2)} = \frac{1}{a} \left( \frac{A}{x-x_1} + \frac{B}{x-x_2} \right)$$
    (Sử dụng phương pháp đồng nhất hệ số để tìm $A, B$).
    $$\longrightarrow I = \frac{1}{a} (A \ln|x-x_1| + B \ln|x-x_2|) + C$$

*   **Trường hợp 2: Mẫu số có nghiệm kép $x_0$.**
    Phân tích:
    $$\frac{mx+n}{ax^2+bx+c} = \frac{mx+n}{a(x-x_0)^2} = \frac{m(x-x_0)+p}{a(x-x_0)^2} = \frac{m}{a(x-x_0)} + \frac{p}{a(x-x_0)^2}$$

*   **Trường hợp 3: Mẫu số vô nghiệm.**
    Phân tích:
    $$\frac{mx+n}{ax^2+bx+c} = \frac{k(2ax+b)}{ax^2+bx+c} + \frac{p}{ax^2+bx+c}$$
    $$\frac{mx+n}{ax^2+bx+c} = \frac{k(2ax+b)}{ax^2+bx+c} + \frac{p}{a[(x-x_0)^2+q^2]}$$
    Khi đó:
    $$I = k \int \frac{d(ax^2+bx+c)}{ax^2+bx+c} + \frac{p}{a} \int \frac{1}{(x-x_0)^2+q^2} dx$$

### 3. Bấm máy tính nguyên hàm hữu tỉ
Ta có:
$$\int \frac{mx+n}{ax^2+bx+c} dx = \frac{1}{a} \int \frac{mx+n}{(x-x_1)(x-x_2)} dx = \frac{1}{a} \int \left( \frac{A}{x-x_1} + \frac{B}{x-x_2} \right) dx = \frac{1}{a} (A \ln|x-x_1| + B \ln|x-x_2|) + C$$

**Tìm A, B nhanh bằng cách:**

*   **Bước 1:** Nhập vào máy tính biểu thức: $\frac{mx+n}{\frac{d}{dx} ((x-x_1)(x-x_2))|_{x=X}}$
*   **Bước 2:** Tìm $A$: [CALC] $x=x_1$.
*   **Bước 3:** Tìm $B$: [CALC] $x=x_2$.
