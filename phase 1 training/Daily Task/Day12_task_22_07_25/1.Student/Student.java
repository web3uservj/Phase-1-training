public class Student {
    private String name;
    private int id;
    private int age;
    private double grade;
    private String address;


    public Student() {
        this.name = "";
        this.id = 0;
        this.age = 0;
        this.grade = 0.0;
        this.address = "";
    }

    
    public Student(String name, int id, int age, double grade, String address) {
        this.name = name;
        this.id = id;
        this.age = age;
        this.grade = grade;
        this.address = address;
    }

  
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public double getGrade() {
        return grade;
    }

    public void setGrade(double grade) {
        this.grade = grade;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

  
    public void display() {
        System.out.println("Name: " + name);
        System.out.println("ID: " + id);
        System.out.println("Age: " + age);
        System.out.println("Grade: " + grade);
        System.out.println("Address: " + address);
    }

    
    public boolean isPassed() {
        return grade > 50;
    }
}
