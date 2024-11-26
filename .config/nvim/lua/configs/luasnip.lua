local ls = require("luasnip")  -- Memuat LuaSnip
local s = ls.snippet           -- Shortcut untuk snippet
local t = ls.text_node         -- Shortcut untuk text_node
local i = ls.insert_node       -- Shortcut untuk insert_node

ls.snippets = {
  all = { -- Snippet ini berlaku untuk semua filetype
    s("pyblock", {
      t({"```{python}", ""}),
      i(1),
      t({"", "```"}),
    }),
  },
  markdown = { -- Untuk filetype markdown dan yang terkait
    s("pyblock", {
      t({"```{python}", ""}),
      i(1),
      t({"", "```"}),
    }),
  },
  quarto = { -- Untuk filetype quarto (qmd)
    s("pyblock", {
      t({"```{python}", ""}),
      i(1),
      t({"", "```"}),
    }),
  },
}

