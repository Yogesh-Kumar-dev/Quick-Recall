// assets
import {
  IconCode,
  IconChecklist,
  IconInfinity,
  IconSearch,
  IconStar,
  IconLayoutRows,
  IconPassword,
  IconDragDrop,
  IconChevronDown,
  IconListCheck,
  IconLayoutColumns,
  IconFolder,
  IconShoppingCart,
  IconTimeline,
  IconPlus,
  IconFilter,
  IconSelector,
  IconWindowMaximize,
  IconForms,
  IconApi,
  IconCircleCheck,
  IconFlame,
  IconSkull
} from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - MACHINE CODING ||============================== //

const icons = {
  IconCode,
  IconChecklist,
  IconInfinity,
  IconSearch,
  IconStar,
  IconLayoutRows,
  IconPassword,
  IconDragDrop,
  IconChevronDown,
  IconListCheck,
  IconLayoutColumns,
  IconFolder,
  IconShoppingCart,
  IconTimeline,
  IconPlus,
  IconFilter,
  IconSelector,
  IconWindowMaximize,
  IconForms,
  IconApi,
  IconCircleCheck,
  IconFlame,
  IconSkull
};

const machineCoding: NavItemType = {
  id: 'machine-coding',
  title: 'Machine Coding',
  caption: 'React Interview Problems',
  icon: icons.IconCode,
  type: 'group',
  children: [
    // ── 🟢 Easy ────────────────────────────────────────────────────────────────
    {
      id: 'mc-easy',
      title: '🟢 Easy',
      type: 'collapse',
      icon: icons.IconCircleCheck,
      children: [
        {
          id: 'mc-counter',
          title: 'Counter',
          type: 'item',
          url: '/machine-coding/counter',
          icon: icons.IconPlus
        },
        {
          id: 'mc-star-rating',
          title: 'Star Rating',
          type: 'item',
          url: '/machine-coding/star-rating',
          icon: icons.IconStar
        },
        {
          id: 'mc-accordion',
          title: 'Accordion',
          type: 'item',
          url: '/machine-coding/accordion',
          icon: icons.IconChevronDown
        },
        {
          id: 'mc-todo',
          title: 'Todo List',
          type: 'item',
          url: '/machine-coding/todo',
          icon: icons.IconChecklist
        },
        {
          id: 'mc-search-filter',
          title: 'Search Filter',
          type: 'item',
          url: '/machine-coding/search-filter',
          icon: icons.IconFilter
        },
        {
          id: 'mc-dropdown',
          title: 'Dropdown',
          type: 'item',
          url: '/machine-coding/dropdown',
          icon: icons.IconSelector
        },
        {
          id: 'mc-modal-popup',
          title: 'Modal Popup',
          type: 'item',
          url: '/machine-coding/modal-popup',
          icon: icons.IconWindowMaximize
        },
        {
          id: 'mc-form-handling',
          title: 'Form Handling',
          type: 'item',
          url: '/machine-coding/form-handling',
          icon: icons.IconForms
        },
        {
          id: 'mc-multi-step-form',
          title: 'Multi-Step Form',
          type: 'item',
          url: '/machine-coding/multi-step-form',
          icon: icons.IconListCheck
        }
      ]
    },

    // ── 🟡 Medium ──────────────────────────────────────────────────────────────
    {
      id: 'mc-medium',
      title: '🟡 Medium',
      type: 'collapse',
      icon: icons.IconFlame,
      children: [
        {
          id: 'mc-api-data-fetching',
          title: 'API Data Fetching',
          type: 'item',
          url: '/machine-coding/api-data-fetching',
          icon: icons.IconApi
        },
        {
          id: 'mc-pagination',
          title: 'Pagination',
          type: 'item',
          url: '/machine-coding/pagination',
          icon: icons.IconLayoutRows
        },
        {
          id: 'mc-debounced-search',
          title: 'Debounced Search',
          type: 'item',
          url: '/machine-coding/debounced-search',
          icon: icons.IconSearch
        },
        {
          id: 'mc-otp-input',
          title: 'OTP Input',
          type: 'item',
          url: '/machine-coding/otp-input',
          icon: icons.IconPassword
        },
        {
          id: 'mc-tabs',
          title: 'Tabs Component',
          type: 'item',
          url: '/machine-coding/tabs',
          icon: icons.IconLayoutColumns
        },
        {
          id: 'mc-sequential-progress-bars',
          title: 'Sequential Progress Bars',
          type: 'item',
          url: '/machine-coding/sequential-progress-bars',
          icon: icons.IconTimeline
        }
      ]
    },

    // ── 🔴 Hard ────────────────────────────────────────────────────────────────
    {
      id: 'mc-hard',
      title: '🔴 Hard',
      type: 'collapse',
      icon: icons.IconSkull,
      children: [
        {
          id: 'mc-infinite-scroll',
          title: 'Infinite Scroll',
          type: 'item',
          url: '/machine-coding/infinite-scroll',
          icon: icons.IconInfinity
        },
        {
          id: 'mc-drag-drop',
          title: 'Drag & Drop',
          type: 'item',
          url: '/machine-coding/drag-and-drop',
          icon: icons.IconDragDrop
        },
        {
          id: 'mc-file-tree',
          title: 'File Tree Explorer',
          type: 'item',
          url: '/machine-coding/file-tree',
          icon: icons.IconFolder
        },
        {
          id: 'mc-shopping-cart',
          title: 'Shopping Cart',
          type: 'item',
          url: '/machine-coding/shopping-cart',
          icon: icons.IconShoppingCart
        }
      ]
    }
  ]
};

export default machineCoding;
