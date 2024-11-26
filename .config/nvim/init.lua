-- Set Python 3 provider
vim.g.python3_host_prog = '/home/bayu/Documents/env/bin/python3'

-- Bootstrap lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "--branch=stable", -- latest stable release
    "https://github.com/folke/lazy.nvim.git",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

-- Load options, mappings, and autocmds
require('configs.options')
require('configs.mappings')
require('configs.autocmds')

-- Setup lazy.nvim and load plugins
require("lazy").setup({
  spec = {
    -- Import your plugin configurations
    { import = "plugins" },
  },
  -- Automatically check for plugin updates
  checker = { enabled = true },
  install = { colorscheme = { "habamax" } },
})

-- Load additional LSP configurations
require('configs.lspconfig')

-- Load snippet
require("configs.luasnip")
require('configs.abbreviations')

-- Custom command untuk menyisipkan template kode Python
vim.api.nvim_create_user_command('InsertPythonBlock', function()
  local template = {
    "```{python}",
    "  ",  -- Baris ini akan menjadi tempat kursor
    "```",
  }

  -- Sisipkan template ke dalam buffer
  vim.api.nvim_put(template, 'l', true, true)

  -- Pindahkan kursor ke baris kedua
  vim.api.nvim_win_set_cursor(0, {vim.api.nvim_win_get_cursor(0)[1] - 2, 2})
end, {})

