#include<iostream>
using namespace std;

// // ฟังก์ชันสำหรับทำ Gaussian Elimination
// void forward(double** m, int size, int currentRow);

// void gaussElimination(int size, double** m) {
//     for (int i = 0; i < size; i++) {
//         double pivot = m[i][i];
//         forward(m, size, i);  // ทำการลบแถวด้านล่างของ pivot
//     }
// }

// void forward(double** m, int size, int currentRow) {
//     double pivot = m[currentRow][currentRow];
    
//     for (int i = currentRow + 1; i < size; i++) {
//         double factor = m[i][currentRow] / pivot;  // คำนวณ factor เพื่อลบแถว
//         for (int j = currentRow; j < size + 1; j++) {
//             m[i][j] -= factor * m[currentRow][j];  // ลบค่าด้วย factor
//         }
//     }
// }

// // ฟังก์ชันสำหรับทำ Backward Substitution
// void backwardSubstitution(double** m, double* x, int size) {
//     // เริ่มจากแถวสุดท้าย แล้วแทนค่าถอยหลังขึ้นไป
//     for (int i = size - 1; i >= 0; i--) {
//         x[i] = m[i][size];  // ค่าเริ่มต้นของ x[i] คือค่าในตำแหน่งขวาสุด (B)

//         // แทนค่าตัวแปรที่รู้แล้วจากแถวบนๆ
//         for (int j = i + 1; j < size; j++) {
//             x[i] -= m[i][j] * x[j];
//         }

//         // หารด้วยค่าของตัวเอง (pivot)
//         x[i] /= m[i][i];
//     }
// }

// int main() {
//     int size;
//     cout << "Enter the size of the matrix (n for n x n): ";
//     cin >> size;

//     // สร้างเมทริกซ์ขนาด n x (n+1)
//     double** m = new double*[size];
//     for (int i = 0; i < size; i++) {
//         m[i] = new double[size + 1];
//     }

//     // สร้างอาร์เรย์สำหรับเก็บผลลัพธ์ x
//     double* x = new double[size];

//     // รับค่าเมทริกซ์ A และ B จากผู้ใช้
//     cout << "Enter the elements of matrix A (n x n):\n";
//     for (int i = 0; i < size; i++) {
//         for (int j = 0; j < size; j++) {
//             cin >> m[i][j];  // รับค่าเมทริกซ์ A
//         }
//     }

//     cout << "Enter the elements of matrix B (n x 1):\n";
//     for (int i = 0; i < size; i++) {
//         cin >> m[i][size];  // รับค่าเมทริกซ์ B (แถวสุดท้ายของ m)
//     }

//     // เรียกใช้งานฟังก์ชัน Gaussian Elimination
//     gaussElimination(size, m);

//     // แสดงผลลัพธ์เมทริกซ์หลังการทำ Gaussian Elimination
//     cout << "After Gauss Elimination:\n";
//     for (int i = 0; i < size; i++) {
//         for (int j = 0; j < size + 1; j++) {
//             cout << m[i][j] << " ";
//         }
//         cout << endl;
//     }

//     // เรียกใช้งานฟังก์ชัน Backward Substitution
//     backwardSubstitution(m, x, size);

//     // แสดงผลลัพธ์ตัวแปร x หลังจากการแทนค่าถอยหลัง
//     cout << "\nSolution (values of x):\n";
//     for (int i = 0; i < size; i++) {
//         cout << "x" << i + 1 << " = " << x[i] << endl;
//     }

//     // ลบเมทริกซ์ออกจากหน่วยความจำ
//     for (int i = 0; i < size; i++) {
//         delete[] m[i];
//     }
//     delete[] m;
//     delete[] x;

//     return 0;
// }
int main(){
    int n = 3;
    double a[n][n] ={ {-2,3,1} , {3,4,-5} , {1,-2,1}};
    double b[n] = {9,0,-4};
    double x[n];
    double result[n];
    
    for(int k = 0 ; k <= n-1 ;k++){
        for(int i = k+1 ; i<=n ;i++){
            a[i][k] = a[i][k] / a[k][k];
            for(int j = k+1 ; j <= n ; j++){
                a[i][j] = a[i][j]  -  a[i][k] * a[k][j];
            }
            b[i] -= a[i][k] * b[k];
            a[i][k] = 0;
        }
    }
    for (int i = 0; i < n; i++)
    {
        for (int j = 0 ;  j < n ; j++){
            cout << a[i][j] << " ";
        }cout << b[i];
        cout << endl;
    }
    
    for (int i = n - 1; i >= 0; i--) {
        double s = b[i];
        for (int j = i + 1; j < n; j++) {
            s -= a[i][j] * x[j];
        }
        x[i] = s / a[i][i];
    }

    for (int i = 0; i < n; i++)
    {
        cout << x[i] <<" ";
    }
    
    
    return 0;
}