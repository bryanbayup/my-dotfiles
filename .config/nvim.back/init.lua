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

