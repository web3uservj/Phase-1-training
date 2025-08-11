import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Vehicle vehicle = null;
        
        while (true) {
            System.out.println("\n--- Vehicle Management Menu ---");
            System.out.println("1. Create Two Wheeler");
            System.out.println("2. Create Four Wheeler");
            System.out.println("3. Display Vehicle Details");
            System.out.println("4. Exit");
            System.out.print("Choose an option: ");
            
            int choice = sc.nextInt();
            sc.nextLine();  

            switch (choice) {
                case 1:
                   
                    System.out.print("Enter Make: ");
                    String make2W = sc.nextLine();
                    System.out.print("Enter Vehicle Number: ");
                    String vehicleNumber2W = sc.nextLine();
                    System.out.print("Enter Fuel Type: ");
                    String fuelType2W = sc.nextLine();
                    System.out.print("Enter Fuel Capacity: ");
                    int fuelCapacity2W = sc.nextInt();
                    System.out.print("Enter CC: ");
                    int cc2W = sc.nextInt();
                    System.out.print("Is Kick Start Available (true/false): ");
                    Boolean kickStartAvailable = sc.nextBoolean();
                    sc.nextLine();  
                    vehicle = new TwoWheeler(make2W, vehicleNumber2W, fuelType2W, fuelCapacity2W, cc2W, kickStartAvailable);
                    break;
                
                case 2:
                  
                    System.out.print("Enter Make: ");
                    String make4W = sc.nextLine();
                    System.out.print("Enter Vehicle Number: ");
                    String vehicleNumber4W = sc.nextLine();
                    System.out.print("Enter Fuel Type: ");
                    String fuelType4W = sc.nextLine();
                    System.out.print("Enter Fuel Capacity: ");
                    int fuelCapacity4W = sc.nextInt();
                    System.out.print("Enter CC: ");
                    int cc4W = sc.nextInt();
                    sc.nextLine();  
                    System.out.print("Enter Audio System: ");
                    String audioSystem = sc.nextLine();
                    System.out.print("Enter Number of Doors: ");
                    int numberOfDoors = sc.nextInt();
                    sc.nextLine(); 
                    vehicle = new FourWheeler(make4W, vehicleNumber4W, fuelType4W, fuelCapacity4W, cc4W, audioSystem, numberOfDoors);
                    break;
                
                case 3:
                   
                    if (vehicle != null) {
                        vehicle.displayMake();
                        vehicle.displayBasicInfo();
                        vehicle.displayDetailInfo();
                    } else {
                        System.out.println("No vehicle created yet.");
                    }
                    break;

                case 4:
                    System.out.println("Exiting program.");
                    sc.close();
                    return;
                
                default:
                    System.out.println("Invalid option, please try again.");
            }
        }
    }
}
