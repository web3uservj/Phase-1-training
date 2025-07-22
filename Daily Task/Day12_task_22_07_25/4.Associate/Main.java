import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
       
        Associate associate = new Associate();

       
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter Associate ID: ");
        associate.setAssociateId(sc.nextInt());
        sc.nextLine(); 
        System.out.print("Enter Associate Name: ");
        associate.setAssociateName(sc.nextLine());

       
        System.out.print("Enter the number of days of training completed: ");
        int days = sc.nextInt();

      
        associate.trackAssociateStatus(days);

        
        associate.displayDetails();

        
        sc.close();
    }
}
