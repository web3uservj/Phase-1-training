public class PGStudent extends Student {
    private String specialization;
    private int noOfPapersPublished;

   
    public PGStudent() {
        super();
        this.specialization = "";
        this.noOfPapersPublished = 0;
    }

   
    public PGStudent(String name, int id, int age, double grade, String address, String specialization, int noOfPapersPublished) {
        super(name, id, age, grade, address);
        this.specialization = specialization;
        this.noOfPapersPublished = noOfPapersPublished;
    }

   
    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public int getNoOfPapersPublished() {
        return noOfPapersPublished;
    }

    public void setNoOfPapersPublished(int noOfPapersPublished) {
        this.noOfPapersPublished = noOfPapersPublished;
    }

    @Override
    public void display() {
        super.display();
        System.out.println("Specialization: " + specialization);
        System.out.println("Number of Papers Published: " + noOfPapersPublished);
    }

    @Override
    public boolean isPassed() {
        return getGrade() > 70 && noOfPapersPublished >= 2;
    }
}
