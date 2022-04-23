The app is intended to generate an SVG toy-illustration of how the chromatin fibers are organized in the nuclear space. It models the distribution of chromatin in random-walk fashion and uniformely distributes the molecules of the nuclear envelope (Lamin molecules) throughout the perimeter of the nuclear shell. The peripheral layer of Lamin molecules attracts the fibers of chromatin, shaping the overall distribution of them. 

Motivation: It's commonly accepted that lamin molecules attract and position the peripheral fraction of chromatin, shape its eventual radial distribution and, by this way, it can manage the overall gene expression of the nucleus. The abscence or damadge of the Lamin (e.g. due to some point mutation in Lamin gene) may affect the distribution of chromatin and introduce the dramatic changes in gene expression, which can lead to the various desiases in humans and animals from the moderate muscular distrophy to early death.

An example of normal nucleus (The green molecules of Lamin B is attached to the envelope and chromatin tends to walk toward the periphery):
![Normal](./examples/norm.png)

An example of Lamin B - mutant nucleus (Both Lamin and chromatin is evenly distributed).
![Mutant](./examples/mut.png)

The affinity of the Lamin molecules to the nuclear envelope can be adjusted by the `LAMIN_RADIAL_DENSITY` parameter.
