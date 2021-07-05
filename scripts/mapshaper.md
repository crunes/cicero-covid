## Steps to edit data in Mapshaper

1. Import Municipality.geojson and most_recent.csv
2. Project the map (but only for SVG! Skip this step if creating the TopoJSON): ```proj merc```
3. Join the two datasets: ```join most_recent keys=MUNICIPALITY,city```
4. Classify the towns by ```pct_complete_vax```:

```
classify pct_complete_vax color-scheme=PiYG breaks=0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9 key-style=simple
```


For essential workers:

1. ```each GEOID=GEOID.toString()```
2. ```join essential-workers keys=GEOID,GEOID```
3. ```classify essential colors=Greens breaks=.25,.5,.75```
4. ```proj merc```
