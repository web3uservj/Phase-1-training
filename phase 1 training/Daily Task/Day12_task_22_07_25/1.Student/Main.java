public class Main {
    public static void main(String[] args) {
      
        Student student = new Student("Alice", 101, 20, 65.5, "123 Main St");
        UGStudent ugStudent = new UGStudent("Bob", 102, 21, 80.0, "456 Oak St", "BSc", "Computer Science");
        PGStudent pgStudent = new PGStudent("Charlie", 103, 24, 75.0, "789 Pine St", "AI", 3);

      
        System.out.println("Student Details:");
        student.display();
        System.out.println("Passed: " + student.isPassed());

        System.out.println("\nUG Student Details:");
        ugStudent.display();
        System.out.println("Passed: " + ugStudent.isPassed());

        System.out.println("\nPG Student Details:");
        pgStudent.display();
        System.out.println("Passed: " + pgStudent.isPassed());
    }
}
