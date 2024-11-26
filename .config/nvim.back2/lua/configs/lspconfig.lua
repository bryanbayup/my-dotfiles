local lspconfig = require('lspconfig')
local on_attach = function(client, bufnr)
  -- Key mappings for LSP
  local buf_map = vim.api.nvim_buf_set_keymap
  local opts = { noremap = true, silent = true }
  buf_map(bufnr, 'n', 'gd', '<cmd>lua vim.lsp.buf.definition()<CR>', opts)
  buf_map(bufnr, 'n', 'K', '<cmd>lua vim.lsp.buf.hover()<CR>', opts)
end

lspconfig.pyright.setup {
  on_attach = on_attach,
  flags = {
    debounce_text_changes = 150,
  },
  settings = {
    python = {
      analysis = {
        typeCheckingMode = "off",
      },
    },
  },
}

