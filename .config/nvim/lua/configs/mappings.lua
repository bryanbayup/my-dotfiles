local map = vim.keymap.set
local opts = { noremap = true, silent = true }

-- Leader key
vim.g.mapleader = ' '
vim.g.maplocalleader = ','

-- Save with Ctrl+s
map('n', '<C-s>', ':w<CR>', opts)
map('i', '<C-s>', '<ESC>:w<CR>a', opts)

-- Pindah ke buffer berikutnya
map('n', '<leader>bn', ':bnext<CR>', opts)

-- Pindah ke buffer sebelumnya
map('n', '<leader>bp', ':bprevious<CR>', opts)

-- Menutup buffer saat ini
map('n', '<leader>x', ':bd<CR>', opts)

-- Navigate splits
map('n', '<C-h>', '<C-w>h', opts)
map('n', '<C-j>', '<C-w>j', opts)
map('n', '<C-k>', '<C-w>k', opts)
map('n', '<C-l>', '<C-w>l', opts)

-- File explorer dengan Ranger
map('n', '<leader>e', '', {
  noremap = true,
  callback = function()
    require("ranger-nvim").open(true) -- Buka Ranger dan fokus pada file saat ini
  end,
  silent = true,
})

-- Telescope
map('n', '<leader>ff', ':Telescope find_files<CR>', opts)
map('n', '<leader>fg', ':Telescope live_grep<CR>', opts)
map('n', '<leader>fb', ':Telescope buffers<CR>', opts)
map('n', '<leader>fh', ':Telescope help_tags<CR>', opts)

-- ToggleTerm
map('n', '<leader>tt', ':ToggleTerm<CR>', opts)
map('t', '<Esc>', '<C-\\><C-n>:ToggleTerm<CR>', opts) -- Menutup toggleterm

-- RunCode
map('n', '<leader>r', ':RunCode<CR>', opts)
map('n', '<leader>rf', ':RunFile<CR>', opts)
map('n', '<leader>rft', ':RunFile tab<CR>', opts)
map('n', '<leader>rp', ':RunProject<CR>', opts)
map('n', '<leader>rc', ':RunClose<CR>', opts)
map('n', '<leader>crf', ':CRFiletype<CR>', opts)
map('n', '<leader>crp', ':CRProjects<CR>', opts)

-- Molten
map("n", "<localleader>mi", ":MoltenInit<CR>", opts)
map("n", "<localleader>eo", ":MoltenEvaluateOperator<CR>", opts)
map("n", "<localleader>el", ":MoltenEvaluateLine<CR>", opts)
map("n", "<localleader>ec", ":MoltenReevaluateCell<CR>", opts)
map("v", "<localleader>ev", ":<C-u>MoltenEvaluateVisual<CR>gv", opts)

-- Insert Python Block
map('n', '<leader>pb', ':InsertPythonBlock<CR>', opts)

