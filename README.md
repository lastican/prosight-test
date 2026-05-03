# Prosight Dev Test project

## Test accounts for testing

- admin123: pass1   | Admin role
- normal123: pass2  | Normal role
- limiter321: pass3 | Limited role

## Known issues

1) In the task description, the API response example shows ursTaxid outside of locus_members. But looking at the database, it seems ursTaxid is actually unique per locus member in rnc_locus_members (rlm). So in the implementation, endpoint just return the ursTaxid from the first member, even though all ursTaxid are still fetched internally