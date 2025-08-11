public class Main {
    
    
    static abstract class Shape {
        
        public abstract double calculateArea();
    }

   
    static class Square extends Shape {
        private double side;

        
        public Square(double side) {
            this.side = side;
        }

       
        @Override
        public double calculateArea() {
            return side * side;
        }
    }

   
    static class Triangle extends Shape {
        private double base;
        private double height;

        
        public Triangle(double base, double height) {
            this.base = base;
            this.height = height;
        }

       
        @Override
        public double calculateArea() {
            return 0.5 * base * height;
        }
    }

    
    static class Rectangle extends Shape {
        private double length;
        private double width;

      
        public Rectangle(double length, double width) {
            this.length = length;
            this.width = width;
        }

      
        @Override
        public double calculateArea() {
            return length * width;
        }
    }

    public static void main(String[] args) {
       
        Shape square = new Square(5);
        Shape triangle = new Triangle(4, 6);
        Shape rectangle = new Rectangle(4, 7);


        System.out.println("Area of Square: " + square.calculateArea());
        System.out.println("Area of Triangle: " + triangle.calculateArea());
        System.out.println("Area of Rectangle: " + rectangle.calculateArea());
    }
}
