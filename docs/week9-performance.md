### EXPLAIN Interpretation

MySQL used a range scan with the single-column
`idx_property_baths` index.

- Access type: `range`
- Selected index: `idx_property_baths`
- Estimated rows: 17,727
- Estimated filtered rows: 8.33%
- Actual rows scanned: 46,752
- Final rows returned: 8
- Actual runtime: ~7.0 seconds

Although the query avoided a full table scan, it still inspected a large
number of rows because most remaining filters were evaluated after the
bathrooms index scan. This indicated that a composite index could improve
the query.