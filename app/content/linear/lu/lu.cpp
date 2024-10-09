#include <iostream>

using namespace std;

void diagonalization(double a[][3], int n) {
    for (int k = 0; k < n - 1; k++) {
        for (int i = k + 1; i < n; i++) {
            a[i][k] = a[i][k] / a[k][k];
            for (int j = k + 1; j < n; j++) {
                a[i][j] = a[i][j] - a[i][k] * a[k][j];
            }
        }
    }
}

void forward_substitution(double a[][3], double b[], double x[], int n) {
    x[0] = b[0];
    
    for (int i = 1; i < n; i++) {
        double s = 0;
        for (int j = 0; j < i; j++) {
            s += a[i][j] * x[j];
        }
        x[i] = b[i] - s;
    }
}

void back_substitution(double a[][3], double x[], int n) {
    x[n - 1] = x[n - 1] / a[n - 1][n - 1];
    
    for (int i = n - 2; i >= 0; --i) {
        double s = 0;
        for (int j = i + 1; j < n; ++j) {
            s += a[i][j] * x[j];
        }
        x[i] = (x[i] - s) / a[i][i];
    }
}

int main() {
    int n = 3; // ขนาดของเมทริกซ์
    double a[3][3] = {{-2, 3, 1}, {3, 4, -5}, {1, -2, 1}}; // เมทริกซ์ A
    double b[3] = {9, 0, -4}; // เวกเตอร์ B
    double x[3]; // สำหรับเก็บผลลัพธ์
    
    // Diagonalization
    diagonalization(a, n);
    
    // Forward substitution
    forward_substitution(a, b, x, n);
    
    // Back substitution
    back_substitution(a, x, n);
    
    // แสดงผลลัพธ์
    cout << "Solution vector x: ";
    for (int i = 0; i < n; ++i) {
        cout << x[i] << " ";
    }
    cout << endl;
    
    return 0;
}
