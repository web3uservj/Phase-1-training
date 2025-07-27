import java.util.List;

public interface PackageDao {
    void addPackage(Package p);
    List<Package> getAllPackages();
    Package findPackageById(String packageId);
    void calculatePackageCost(Package p);
}
