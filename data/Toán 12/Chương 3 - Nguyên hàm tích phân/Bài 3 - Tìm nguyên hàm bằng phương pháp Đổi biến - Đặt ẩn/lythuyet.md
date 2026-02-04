# BÀI 3: PHƯƠNG PHÁP ĐỔI BIẾN TÌM NGUYÊN HÀM

## KIẾN THỨC CẦN NHỚ

### 1. Phương pháp
*   **Bước 1:** Đặt $v(x) = t$.
*   **Bước 2:** Vi phân hai vế: $d(v(x)) = d(t)$.
    *(Vi phân tương tự như đạo hàm, nhưng đạo hàm theo biến $x$, nhân thêm $dx$, đạo hàm theo biến $t$ thì nhân thêm $dt$)*.
    *Ví dụ về vi phân:* $d(x^2 - 2x + 1) = (x^2 - 2x + 1)' dx = (2x - 2)dx$.
*   **Bước 3:** Chuyển hết $f(x)$ về $f(t)$. Sau khi hết dấu nguyên hàm, ta trả biến $t$ về biến $x$.

### 2. Một số dạng đổi biến thường gặp

**a. Đặt f(x) = t**
*   $\int f(ax+b)dx$: Đặt $t = ax+b$
*   $\int f(x^{n+1}) \cdot x^n dx$: Đặt $t = x^{n+1}$

**b. Đặt căn = t**
*   $\int f(\sqrt{u(x)}) \cdot \frac{u'(x)}{2\sqrt{u(x)}} dx$: Đặt $t = \sqrt{u(x)}$

**c. Đặt ln(x) = t**
*   $\int f(\ln x) \cdot \frac{1}{x} dx$: Đặt $t = \ln x$

**d. Đặt mũ = t**
*   $\int f(e^x) \cdot e^x dx$: Đặt $t = e^x$

**e. Đặt lượng giác = t**
*   $\int f(\sin x) \cdot \cos x \ dx$: Đặt $t = \sin x$
*   $\int f(\cos x) \cdot \sin x \ dx$: Đặt $t = \cos x$
*   $\int f(\tan x) \cdot \frac{1}{\cos^2 x} dx$: Đặt $t = \tan x$
*   $\int f(\cot x) \cdot \frac{1}{\sin^2 x} dx$: Đặt $t = \cot x$