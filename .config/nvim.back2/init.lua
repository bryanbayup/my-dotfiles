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

-- Molten.nvim configuration
vim.g.molten_auto_open_output = true        -- Secara otomatis membuka jendela output saat ada output
vim.g.molten_virt_text_output = true        -- Menampilkan output sebagai teks virtual
vim.g.molten_output_win_hide_on_leave = false -- Jangan sembunyikan jendela output saat kursor dipindahkan
vim.g.molten_wrap_output = true             -- Bungkus output jika terlalu panjang
vim.g.molten_virt_lines_off_by_1 = true     -- Menempatkan output di bawah cell

