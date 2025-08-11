public class Associate {
    private int associateId;
    private String associateName;
    private String workStatus;


    public Associate() {
    }

    
    public Associate(int associateId, String associateName, String workStatus) {
        this.associateId = associateId;
        this.associateName = associateName;
        this.workStatus = workStatus;
    }

  
    public int getAssociateId() {
        return associateId;
    }

    public void setAssociateId(int associateId) {
        this.associateId = associateId;
    }

   
    public String getAssociateName() {
        return associateName;
    }

    public void setAssociateName(String associateName) {
        this.associateName = associateName;
    }

    
    public String getWorkStatus() {
        return workStatus;
    }

    public void setWorkStatus(String workStatus) {
        this.workStatus = workStatus;
    }

  
    public void trackAssociateStatus(int days) {
        if (days <= 20) {
            this.workStatus = "Learning Core skills";
        } else if (days <= 40) {
            this.workStatus = "Learning Advanced modules";
        } else if (days <= 60) {
            this.workStatus = "In Project phase";
        } else {
            this.workStatus = "Deployed in project";
        }
    }

    
    public void displayDetails() {
        System.out.println("Associate ID: " + associateId);
        System.out.println("Associate Name: " + associateName);
        System.out.println("Work Status: " + workStatus);
    }
}
