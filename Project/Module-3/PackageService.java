import java.util.List;

public interface PackageService {
    void addPackage(Package p) throws InvalidPackageIdException;
    List<Package> fetchAllPackages();
    Package findPackageById(String packageId);
    void calculatePackageCost(String packageId) throws InvalidPackageIdException;
}
