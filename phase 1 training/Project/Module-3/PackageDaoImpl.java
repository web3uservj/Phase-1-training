import java.util.*;

public class PackageDaoImpl implements PackageDao {
    private List<Package> packageList = new ArrayList<>();

    @Override
    public void addPackage(Package p) {
        packageList.add(p);
    }

    @Override
    public List<Package> getAllPackages() {
        return packageList;
    }

    @Override
    public Package findPackageById(String packageId) {
        for (Package p : packageList) {
            if (p.getPackageId().equalsIgnoreCase(packageId)) {
                return p;
            }
        }
        return null;
    }

    @Override
    public void calculatePackageCost(Package p) {
        double totalCost = p.getBasicFare() * p.getNoOfDays();
        double discount = 0.0;

        int days = p.getNoOfDays();
        if (days > 5 && days <= 8) {
            discount = totalCost * 0.03;
        } else if (days > 8 && days <= 10) {
            discount = totalCost * 0.05;
        } else if (days > 10) {
            discount = totalCost * 0.07;
        }

        double afterDiscount = totalCost - discount;
        double gst = afterDiscount * 0.12;
        double finalCost = afterDiscount + gst;

        p.setPackageCost(finalCost);
    }
}
