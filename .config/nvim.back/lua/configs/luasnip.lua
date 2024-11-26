local ls = require("luasnip")
local s = ls.snippet
local t = ls.text_node
local i = ls.insert_node

ls.snippets = {
  all = {  -- Snippet yang berlaku untuk semua jenis file
    -- Snippet untuk blok kode Python
    s("pyblock", {
      t({"```{python}", ""}),
      i(1),  -- Tempatkan kursor di sini setelah memicu snippet
      t({"", "```"}),
    }),

    -- Snippet untuk metadata dokumen
    s("metadata", {
      t({"---", "title : "}), i(1, "Example"),
      t({"", "format : "}), i(2, "html"),
      t({"", "---", ""}),
    }),
  },
}

