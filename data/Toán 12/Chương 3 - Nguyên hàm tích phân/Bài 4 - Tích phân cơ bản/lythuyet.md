# BÀI 4. TÍCH PHÂN CƠ BẢN VÀ TÍCH PHÂN HỮU TỶ

## KIẾN THỨC CẦN NHỚ

### 1. Tích phân
Cho $f(x)$ là hàm số liên tục trên đoạn $[a; b]$. Giả sử $F(x)$ là một nguyên hàm của $f(x)$ trên đoạn $[a; b]$.

Tích phân từ $a$ đến $b$ của $f(x)$: 
$$\int_{a}^{b} f(x) dx = F(x) \Big|_a^b = F(b) - F(a)$$

*   **Quy ước**
    *   $\int_{a}^{a} f(x) dx = 0$
    *   $\int_{a}^{b} f(x) dx = -\int_{b}^{a} f(x) dx$
    *   $\int_{a}^{b} f(x) dx = \int_{a}^{b} f(t) dt = \int_{a}^{b} f(u) du$

### 2. Tính chất
*   $\int_{a}^{b} k \cdot f(x) dx = k \int_{a}^{b} f(x) dx$ (với $k$ là hằng số)
*   $\int_{a}^{b} [f(x) \pm g(x)] dx = \int_{a}^{b} f(x) dx \pm \int_{a}^{b} g(x) dx$
*   $\int_{a}^{b} f(x) dx = \int_{a}^{c} f(x) dx + \int_{c}^{b} f(x) dx$ với $(a < c < b)$