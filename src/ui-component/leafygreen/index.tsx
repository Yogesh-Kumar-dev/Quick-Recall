import type { ComponentType } from 'react';

// leafygreen
import { Button, type ButtonProps, Variant as ButtonVariant, Size as ButtonSize } from '@leafygreen-ui/button';
import { Card, type CardProps } from '@leafygreen-ui/card';
import { Badge, Variant as BadgeVariant } from '@leafygreen-ui/badge';

// ==============================|| LEAFYGREEN COMPONENT BARREL ||============================== //
//
// Real @leafygreen-ui components, re-exported under LG* names so showcase spots have a single
// import path and the LeafyGreen dependency stays localized. These follow the app's light/dark
// toggle automatically via <LeafyGreenBridge> (mounted in ProviderWrapper), which maps our
// ConfigContext mode onto LeafyGreen's own dark-mode context.
//
// LeafyGreen ships its own Emotion instance (separate from MUI), so these can be mixed with MUI
// components in the same tree. Prefer these only for deliberate high-visibility spots — the rest
// of the app stays on themed-MUI to avoid running two styling systems everywhere.
//
// NOTE: Button and Card are LeafyGreen *polymorphic* components whose generated types
// (`InferredPolymorphicComponentType`) aren't recognized as valid JSX element types under React 19.
// We re-type them as plain ComponentTypes so they're usable as `<LGButton/>` / `<LGCard/>`. Badge
// is non-polymorphic and needs no cast.

export const LGButton = Button as ComponentType<ButtonProps>;
export const LGCard = Card as ComponentType<CardProps>;
export const LGBadge = Badge;

export { ButtonVariant as LGButtonVariant, ButtonSize as LGButtonSize, BadgeVariant as LGBadgeVariant };
