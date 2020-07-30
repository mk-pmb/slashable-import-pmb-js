
<!--#echo json="package.json" key="name" underline="=" -->
slashable-import-pmb
====================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Dynamically import modules as resolved from current directory. On failure,
retry with some default filenames appended.
<!--/#echo -->



API
---

This module ESM-exports one function:

### configureSlashableImport([opt])

Returns a function `slashableImport(id)` that returns Promises for attempts
to import the module named `id`.

`opts` is an optional options object that supports these keys:

* `base`: Which perspective to use when searching. Should be either…
  * a false-y value (default: empty string)
    to use the current working directory,
  * or a directory path as a string,
  * or an object with a `filename` or `url` property
    (e.g. your module's `module` object or `import.meta`),
    in which case its containing directory will be used.
* `ext`: An array of filename extensions to use for the search.
  Default: `['.mjs', '.jsm', '.js']`
* `suf`: An array of what suffixes to retry with if the original ID couldn't
  be resolved verbatim and it ends with a slash (`/`).
  Special effects: Any occurrence of `\n` is replaced with the basename
  of the ID.
  Default: `['__main__', '\n']`
* `expo`: Name of the export identifier to import. Default: `'default'`



<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
