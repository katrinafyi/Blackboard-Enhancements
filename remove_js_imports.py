import sys
import os

print(sys.argv[1])
with open(sys.argv[1], 'r') as f:
    with open('./dist/' + os.path.basename(sys.argv[1]), 'w') as o:
        for l in f:
            if (not l.strip().startswith('import ')): 
                o.write(l)
