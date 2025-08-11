public class TwoWheeler extends Vehicle {
    private Boolean kickStartAvailable;

    
    public TwoWheeler(String make, String vehicleNumber, String fuelType, Integer fuelCapacity, Integer cc, Boolean kickStartAvailable) {
        super(make, vehicleNumber, fuelType, fuelCapacity, cc);
        this.kickStartAvailable = kickStartAvailable;
    }

    
    @Override
    public void displayDetailInfo() {
        System.out.println("Kick Start Available: " + (kickStartAvailable ? "Yes" : "No"));
    }

    
    public Boolean getKickStartAvailable() { return kickStartAvailable; }
    public void setKickStartAvailable(Boolean kickStartAvailable) { this.kickStartAvailable = kickStartAvailable; }
}
