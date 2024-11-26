vim.api.nvim_create_autocmd('BufWritePre', {
    pattern = '*',
    command = ':%s/\\s\\+$//e',
})

-- Autocommand untuk .ipynb, .qmd, dan .md files
vim.api.nvim_create_autocmd("BufEnter", {
  pattern = { "*.ipynb", "*.qmd", "*.md" },
  callback = function()
    vim.g.molten_virt_lines_off_by_1 = true
    vim.g.molten_virt_text_output = true
    vim.g.molten_output_win_hide_on_leave = false
  end,
})


