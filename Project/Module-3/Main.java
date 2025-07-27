import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        PackageService service = new PackageServiceImpl();

        while (true) {
            System.out.println("\n--- Holiday Package Menu ---");
            System.out.println("1. Add Package details");
            System.out.println("2. Display all package details");
            System.out.println("3. Search for a package with package id");
            System.out.println("4. Calculate package cost based on package id");
            System.out.println("5. Exit");
            System.out.print("Enter your choice: ");

            int choice = sc.nextInt();
            sc.nextLine(); 

            try {
                switch (choice) {
                    case 1:
                        System.out.print("Enter Package Id: ");
                        String id = sc.nextLine();
                        System.out.print("Enter Source Place: ");
                        String source = sc.nextLine();
                        System.out.print("Enter Destination Place: ");
                        String dest = sc.nextLine();
                        System.out.print("Enter No. of Days: ");
                        int days = sc.nextInt();
                        System.out.print("Enter Basic Fare: ");
                        double fare = sc.nextDouble();

                        Package p = new Package(id, source, dest, days, fare);
                        service.addPackage(p);
                        System.out.println("Package added successfully.");
                        break;

                    case 2:
                        List<Package> allPackages = service.fetchAllPackages();
                        for (Package pkg : allPackages) {
                            System.out.println("ID: " + pkg.getPackageId() +
                                    ", Source: " + pkg.getSourcePlace() +
                                    ", Destination: " + pkg.getDestinationPlace() +
                                    ", Days: " + pkg.getNoOfDays() +
                                    ", Basic Fare: " + pkg.getBasicFare() +
                                    ", Cost: " + pkg.getPackageCost());
                        }
                        break;

                    case 3:
                        System.out.print("Enter Package Id to search: ");
                        String searchId = sc.nextLine();
                        Package found = service.findPackageById(searchId);
                        if (found != null) {
                            System.out.println("Found Package: " + found);
                        } else {
                            System.out.println("Package not found.");
                        }
                        break;

                    case 4:
                        System.out.print("Enter Package Id to calculate cost: ");
                        String calcId = sc.nextLine();
                        service.calculatePackageCost(calcId);
                        Package updated = service.findPackageById(calcId);
                        System.out.println("Updated Package Cost: " + updated.getPackageCost());
                        break;

                    case 5:
                        System.out.println("Exiting...");
                        System.exit(0);

                    default:
                        System.out.println("Invalid choice.");
                }
            } catch (InvalidPackageIdException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }
}
