import java.util.*;
public class PackageServiceImpl implements PackageService {
    private PackageDao dao = new PackageDaoImpl();

    private boolean isValidPackageId(String id) {
        return id != null && id.length() == 7;
    }

    @Override
    public void addPackage(Package p) throws InvalidPackageIdException {
        if (!isValidPackageId(p.getPackageId())) {
            throw new InvalidPackageIdException("Invalid Package Id");
        }
        dao.addPackage(p);
    }

    @Override
    public List<Package> fetchAllPackages() {
        return dao.getAllPackages();
    }

    @Override
    public Package findPackageById(String packageId) {
        return dao.findPackageById(packageId);
    }

    @Override
    public void calculatePackageCost(String packageId) throws InvalidPackageIdException {
        if (!isValidPackageId(packageId)) {
            throw new InvalidPackageIdException("Invalid Package Id");
        }

        Package p = dao.findPackageById(packageId);
        if (p != null) {
            dao.calculatePackageCost(p);
        } else {
            throw new InvalidPackageIdException("Package not found.");
        }
    }
}
