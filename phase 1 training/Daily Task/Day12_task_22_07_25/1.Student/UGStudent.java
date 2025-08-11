public class UGStudent extends Student {
    private String degree;
    private String stream;

  
    public UGStudent() {
        super();
        this.degree = "";
        this.stream = "";
    }

  
    public UGStudent(String name, int id, int age, double grade, String address, String degree, String stream) {
        super(name, id, age, grade, address);
        this.degree = degree;
        this.stream = stream;
    }

  
    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getStream() {
        return stream;
    }

    public void setStream(String stream) {
        this.stream = stream;
    }

  
    @Override
    public void display() {
        super.display();
        System.out.println("Degree: " + degree);
        System.out.println("Stream: " + stream);
    }

  
    @Override
    public boolean isPassed() {
        return getGrade() > 70;
    }
}
