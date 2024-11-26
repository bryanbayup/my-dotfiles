return {
  -- Mason for managing external tools like LSP servers
  {
    "williamboman/mason.nvim",
    config = function()
      require("mason").setup()
    end
  },

  -- Mason LSPconfig bridge to nvim-lspconfig
  {
    "williamboman/mason-lspconfig.nvim",
    dependencies = { "williamboman/mason.nvim", "neovim/nvim-lspconfig" },
    config = function()
      require("mason-lspconfig").setup({
        ensure_installed = { "pyright", "tsserver" }, -- Install specific servers
        automatic_installation = true, -- Automatically install configured servers (with lspconfig)
      })
    end,
  },

  -- LSP Configuration
  {
    "neovim/nvim-lspconfig",
    config = function()
      local lspconfig = require("lspconfig")

      -- Automatically setup LSP servers that are installed via mason
      require("mason-lspconfig").setup_handlers {
        function (server_name)
          lspconfig[server_name].setup {}
        end,
      }
    end,
  },

  -- Treesitter for better syntax highlighting
  {
    "nvim-treesitter/nvim-treesitter",
    run = ":TSUpdate",
    config = function()
      require('nvim-treesitter.configs').setup {
        ensure_installed = { "lua", "python", "markdown", "markdown_inline" },
        highlight = {
          enable = true,
        },
      }
    end,
  },

  -- Code Runner
  {
    "CRAG666/code_runner.nvim",
    config = function()
      require('code_runner').setup({
        filetype = {
          java = "cd $dir && javac $fileName && java $fileNameWithoutExt",
          python = "/home/bayu/Documents/env/bin/python3 -u",
        },
        mode = "toggleterm",
        startinsert = true,
        term = {
          position = "right",
          size = 20,
        },
      })
    end,
  },

  -- ToggleTerm for terminal management
  {
    "akinsho/toggleterm.nvim",
    config = function()
      require("toggleterm").setup{
        direction = 'float',
      }
    end
  },

  -- Molten.nvim for Jupyter integration
  {
    "benlubas/molten-nvim",
    version = "^1.0.0",
    dependencies = { "3rd/image.nvim" },
    build = ":UpdateRemotePlugins",
    init = function()
      vim.g.molten_image_provider = "image.nvim"
      vim.g.molten_output_win_max_height = 20
    end,
  },
  {
    "3rd/image.nvim",
    opts = {
      backend = "kitty",
      max_width = 100,
      max_height = 12,
      max_height_window_percentage = math.huge,
      max_width_window_percentage = math.huge,
      window_overlap_clear_enabled = true,
    },
  },

  -- Quarto.nvim for .qmd files
  {
    'quarto-dev/quarto-nvim',
    opts = {
        lspFeatures = {
            languages = { "r", "python", "julia", "bash", "html" }, -- Tambahkan bahasa yang diperlukan
            diagnostics = {
                enabled = true,
                triggers = { "BufWritePost" },
            },
            completion = {
                enabled = true,
            },
        },
    },
    dependencies = {
        'jmbuhr/otter.nvim',
    },
},


  -- Codeium for AI-powered completion
  {
    "Exafunction/codeium.nvim",
    dependencies = { "nvim-lua/plenary.nvim", "hrsh7th/nvim-cmp" },
    config = function()
      require("codeium").setup({})
    end,
    lazy = false,
  },

  -- Snippet support
  {
    "L3MON4D3/LuaSnip",
    version = "v2.*",
    build = "make install_jsregexp",
    config = function()
    --  require("luasnip.loaders.from_vscode").lazy_load()
      require("luasnip.loaders.from_lua").lazy_load({ paths = "/home/bayu/.config/nvim/lua/configs/luasnip.lua" })
    end,
  },

  {
  'hrsh7th/nvim-cmp',
  config = function()
    local cmp = require('cmp')
    local luasnip = require('luasnip')

    cmp.setup({
      snippet = {
        expand = function(args)
          luasnip.lsp_expand(args.body)
        end,
      },
      mapping = cmp.mapping.preset.insert({
        ['<C-b>'] = cmp.mapping.scroll_docs(-4),
        ['<C-f>'] = cmp.mapping.scroll_docs(4),
        ['<C-Space>'] = cmp.mapping.complete(),
        ['<CR>'] = cmp.mapping.confirm({ select = true }),
        ['<Tab>'] = cmp.mapping.select_next_item(),
        ['<S-Tab>'] = cmp.mapping.select_prev_item(),
      }),
      sources = cmp.config.sources({
        { name = 'nvim_lsp' },
        { name = 'LuaSnip' },
        { name = 'buffer' },
        { name = 'path' },
        { name = 'codeium' }, -- AI-powered code completion
      })
    })
  end,
  dependencies = {
    'hrsh7th/cmp-nvim-lsp',
    'hrsh7th/cmp-buffer',
    'hrsh7th/cmp-path',
    'hrsh7th/cmp-cmdline',
    'saadparwaiz1/cmp_luasnip',
    'L3MON4D3/LuaSnip',
    'hrsh7th/cmp-nvim-lsp-signature-help',
  },
},
-- Jupytext.nvim for seamless notebook integration
  {
    "GCBallesteros/jupytext.nvim",
    config = function()
      require("jupytext").setup({
        style = "markdown", -- Default is "hydrogen", can be "light", "quarto", etc.
        output_extension = "md", -- Convert .ipynb files to markdown
        force_ft = "markdown", -- Set filetype to markdown
        custom_language_formatting = {
          python = {
            extension = "qmd",
            style = "quarto",
            force_ft = "quarto",
          },
        },
      })
    end,
    lazy = false, -- Ensure the plugin is not lazily loaded
  },

  {
    'nvim-telescope/telescope.nvim', tag = '0.1.8',
      dependencies = { 'nvim-lua/plenary.nvim' }
  },

  -- Buffer line
  {
    'romgrk/barbar.nvim',
    requires = {'nvim-tree/nvim-web-devicons'},
    config = function()
      -- Barbar sudah otomatis setup
    end,
  },

-- Install Everblush Theme
  {
    "Everblush/nvim",
    as = "everblush",
    config = function()
      require('everblush').setup({ nvim_tree = { contrast = true } })
      vim.cmd("colorscheme everblush")
    end,
  },

  -- Install lualine untuk status line
  {
    "nvim-lualine/lualine.nvim",
    requires = { "nvim-tree/nvim-web-devicons", opt = true },
    config = function()
      require('lualine').setup {
        options = {
          theme = 'everblush',
          section_separators = '',
          component_separators = '',
          disabled_filetypes = { 'NvimTree', 'dashboard', 'Outline' },
        },
        sections = {
          lualine_a = { 'mode' },
          lualine_b = { 'branch' },
          lualine_c = { 'filename' },
          lualine_x = { 'encoding', 'fileformat', 'filetype' },
          lualine_y = { 'progress' },
          lualine_z = { 'location' },
        },
        inactive_sections = {
          lualine_a = {},
          lualine_b = {},
          lualine_c = { 'filename' },
          lualine_x = { 'location' },
          lualine_y = {},
          lualine_z = {},
        },
        tabline = {},
        extensions = {},
      }
    end,
  },

  {
    "windwp/nvim-autopairs",
    config = function()
      require("nvim-autopairs").setup {}
    end,
  },

  {
  "kelly-lin/ranger.nvim",
  config = function()
    require("ranger-nvim").setup({
      replace_netrw = true, -- Mengganti Netrw dengan Ranger saat membuka direktori
      keybinds = {
        ["ov"] = require("ranger-nvim").OPEN_MODE.vsplit,
        ["oh"] = require("ranger-nvim").OPEN_MODE.split,
        ["ot"] = require("ranger-nvim").OPEN_MODE.tabedit,
        ["or"] = require("ranger-nvim").OPEN_MODE.rifle,
      },
      ui = {
        border = "none",
        height = 0.8,
        width = 0.8,
        x = 0.5,
        y = 0.5,
      }
    })
  end,
},

  {
   "nvim-tree/nvim-web-devicons"
  },
  {
    'barrett-ruth/live-server.nvim',
    build = 'pnpm add -g live-server',
    cmd = { 'LiveServerStart', 'LiveServerStop' },
    config = true
  }
}

