public class FourWheeler extends Vehicle {
    private String audioSystem;
    private Integer numberOfDoors;

   
    public FourWheeler(String make, String vehicleNumber, String fuelType, Integer fuelCapacity, Integer cc, String audioSystem, Integer numberOfDoors) {
        super(make, vehicleNumber, fuelType, fuelCapacity, cc);
        this.audioSystem = audioSystem;
        this.numberOfDoors = numberOfDoors;
    }

    
    @Override
    public void displayDetailInfo() {
        System.out.println("Audio System: " + audioSystem);
        System.out.println("Number of Doors: " + numberOfDoors);
    }

    
    public String getAudioSystem() { return audioSystem; }
    public void setAudioSystem(String audioSystem) { this.audioSystem = audioSystem; }

    public Integer getNumberOfDoors() { return numberOfDoors; }
    public void setNumberOfDoors(Integer numberOfDoors) { this.numberOfDoors = numberOfDoors; }
}
