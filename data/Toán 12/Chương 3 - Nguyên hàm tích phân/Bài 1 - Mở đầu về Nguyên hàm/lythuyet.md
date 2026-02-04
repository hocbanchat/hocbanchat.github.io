# BÀI 1. MỞ ĐẦU VỀ NGUYÊN HÀM

## KIẾN THỨC CẦN NHỚ

### 1. Định nghĩa
Hàm số $f(x)$ được gọi là **nguyên hàm** của $f(x)$ nếu $F'(x) = f(x)$.

### 2. Định lý
$$ \int f(x)dx = F(x) + C $$
$F(x)+C$ là họ nguyên hàm của hàm số $f(x)$.

### 3. Tính chất của nguyên hàm
Nếu $f(x)$ và $g(x)$ là hai hàm số liên tục trên $K$ thì:

*   $\int f'(x)dx = f(x) + C$
*   $\int k.f(x)dx = k.\int f(x)dx$, với $k$ là số thực khác 0
*   $\int [f(x) \pm g(x)]dx = \int f(x)dx \pm \int g(x)dx$

## BẢNG NGUYÊN HÀM CƠ BẢN

| Hàm cơ bản | Hàm hợp $(ax+b)$ | Hàm hợp tổng quát $(u)$ |
| :--- | :--- | :--- |
| $\int x^n dx = \frac{x^{n+1}}{n+1} + C$ | $\int (ax+b)^n dx = \frac{1}{a} \cdot \frac{(ax+b)^{n+1}}{n+1} + C$ | $\int u^n dx = \frac{u^{n+1}}{(n+1).u'} + C$ |
| $\int \frac{1}{x^2} dx = -\frac{1}{x} + C$ | $\int \frac{1}{(ax+b)^2} dx = -\frac{1}{a} \cdot \frac{1}{ax+b} + C$ | |
| $\int \frac{1}{x} dx = \ln|x| + C$ | $\int \frac{1}{ax+b} dx = \frac{1}{a} \ln|ax+b| + C$ | $\int \frac{1}{u} dx = \frac{\ln|u|}{u'} + C$ |
| $\int e^x dx = e^x + C$ | $\int e^{ax+b} dx = \frac{1}{a} e^{ax+b} + C$ | $\int e^u dx = \frac{e^u}{u'} + C$ |
| $\int a^x dx = \frac{a^x}{\ln a} + C$ | $\int a^{mx+n} dx = \frac{a^{mx+n}}{m.\ln a} + C$ | $\int a^u dx = \frac{a^u}{u'.\ln a} + C$ |
| $\int \sin x dx = -\cos x + C$ | $\int \sin(ax+b) dx = -\frac{1}{a} \cos(ax+b) + C$ | $\int \sin u \ dx = -\frac{\cos u}{u'} + C$ |
| $\int \cos x dx = \sin x + C$ | $\int \cos(ax+b) dx = \frac{1}{a} \sin(ax+b) + C$ | $\int \cos u \ dx = \frac{\sin u}{u'} + C$ |
| $\int \frac{1}{\cos^2 x} dx = \tan x + C$ | $\int \frac{1}{\cos^2(ax+b)} dx = \frac{1}{a} \tan(ax+b) + C$ | $\int \frac{1}{\cos^2 u} dx = \frac{\tan u}{u'} + C$ |
| $\int \frac{1}{\sin^2 x} dx = -\cot x + C$ | $\int \frac{1}{\sin^2(ax+b)} dx = -\frac{1}{a} \cot(ax+b) + C$ | $\int \frac{1}{\sin^2 u} dx = -\frac{\cot u}{u'} + C$ |