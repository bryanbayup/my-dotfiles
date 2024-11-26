local map = vim.api.nvim_set_keymap
local opts = { noremap = true, silent = true }

-- Leader key
vim.g.mapleader = ' '

-- Save with Ctrl+s
map('n', '<C-s>', ':w<CR>', opts)
map('i', '<C-s>', '<ESC>:w<CR>a', opts)

-- Navigate splits
map('n', '<C-h>', '<C-w>h', opts)
map('n', '<C-j>', '<C-w>j', opts)
map('n', '<C-k>', '<C-w>k', opts)
map('n', '<C-l>', '<C-w>l', opts)

-- File explorer
map('n', '<leader>e', ':NvimTreeToggle<CR>', opts)

-- Telescope
map('n', '<leader>ff', ':Telescope find_files<CR>', opts)
map('n', '<leader>fg', ':Telescope live_grep<CR>', opts)

-- ToggleTerm
map('n', '<leader>tt', ':ToggleTerm<CR>', opts)

--RunCode
map('n', '<leader>r', ':RunCode<CR>', { noremap = true, silent = true })
map('n', '<leader>rf', ':RunFile<CR>', { noremap = true, silent = true })
map('n', '<leader>rft', ':RunFile tab<CR>', { noremap = true, silent = true })
map('n', '<leader>rp', ':RunProject<CR>', { noremap = true, silent = true })
map('n', '<leader>rc', ':RunClose<CR>', { noremap = true, silent = true })
map('n', '<leader>crf', ':CRFiletype<CR>', { noremap = true, silent = true })
map('n', '<leader>crp', ':CRProjects<CR>', { noremap = true, silent = true })

-- Mapping untuk menutup toggleterm jika terbuka
map('t', '<Esc>', '<C-\\><C-n>:ToggleTerm<CR>', { noremap = true, silent = true })

--molten
vim.keymap.set("n", "<localleader>mi", ":MoltenInit<CR>",
    { silent = true, desc = "Initialize the plugin" })
vim.keymap.set("n", "<localleader>e", ":MoltenEvaluateOperator<CR>",
    { silent = true, desc = "run operator selection" })
vim.keymap.set("n", "<localleader>rl", ":MoltenEvaluateLine<CR>",
    { silent = true, desc = "evaluate line" })
vim.keymap.set("n", "<localleader>rr", ":MoltenReevaluateCell<CR>",
    { silent = true, desc = "re-evaluate cell" })
vim.keymap.set("v", "<localleader>r", ":<C-u>MoltenEvaluateVisual<CR>gv",
    { silent = true, desc = "evaluate visual selection" })
