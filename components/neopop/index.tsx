"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import React, { forwardRef } from "react";
import styled from "styled-components";
import { LoaderCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Measure = number | string;
type CommonProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  gap?: number;
  padding?: number;
  paddingBlock?: number;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: "wrap" | "nowrap";
  width?: Measure;
  height?: Measure;
  minHeight?: Measure;
  maxWidth?: Measure;
};

function measure(value: Measure | undefined) {
  return typeof value === "number" ? `${value}px` : value;
}

function layoutStyle(props: CommonProps): React.CSSProperties {
  return {
    gap: props.gap === undefined ? undefined : `${props.gap * 4}px`,
    padding: props.padding === undefined ? undefined : `${props.padding * 4}px`,
    paddingBlock: props.paddingBlock === undefined ? undefined : `${props.paddingBlock * 4}px`,
    alignItems: props.align === "start" ? "flex-start" : props.align === "end" ? "flex-end" : props.align,
    justifyContent: props.justify === "between" ? "space-between" : props.justify === "around" ? "space-around" : props.justify === "start" ? "flex-start" : props.justify === "end" ? "flex-end" : props.justify,
    flexWrap: props.wrap,
    width: measure(props.width),
    height: measure(props.height),
    minHeight: measure(props.minHeight),
    maxWidth: measure(props.maxWidth),
    ...props.style,
  };
}

function stripLayoutProps(props: CommonProps) {
  const { as, gap, padding, paddingBlock, align, justify, wrap, width, height, minHeight, maxWidth, style, ...rest } = props;
  return { Component: as ?? "div", rest, style: layoutStyle({ as, gap, padding, paddingBlock, align, justify, wrap, width, height, minHeight, maxWidth, style }) };
}

export const HStack = forwardRef<HTMLElement, CommonProps>(function HStack(props, ref) {
  const { Component, rest, style } = stripLayoutProps(props);
  return <Component ref={ref} {...rest} style={style} className={cn("np-stack np-hstack", props.className)} />;
});

export const VStack = forwardRef<HTMLElement, CommonProps>(function VStack(props, ref) {
  const { Component, rest, style } = stripLayoutProps(props);
  return <Component ref={ref} {...rest} style={style} className={cn("np-stack np-vstack", props.className)} />;
});

type SectionProps = CommonProps & {
  variant?: "muted" | "surface";
  dividers?: Array<"top" | "bottom">;
};

export const Section = forwardRef<HTMLElement, SectionProps>(function Section({ variant, dividers, ...props }, ref) {
  const { Component, rest, style } = stripLayoutProps(props);
  return <Component ref={ref} {...rest} style={style} className={cn("np-section", variant && `np-section--${variant}`, dividers?.map((divider) => `np-divider--${divider}`), props.className)} />;
});

type TextProps = Omit<React.HTMLAttributes<HTMLElement>, "color"> & {
  as?: React.ElementType;
  color?: "secondary" | "primary";
  type?: "supporting" | "large";
  weight?: "semibold" | "bold" | "medium";
  size?: "xl";
  maxLines?: number;
};

export function Text({ as: Component = "p", color, type, weight, size, maxLines, className, style, ...props }: TextProps) {
  return <Component {...props} style={{ ...style, WebkitLineClamp: maxLines }} className={cn("np-text", color === "secondary" && "np-text--secondary", type && `np-text--${type}`, weight && `np-text--${weight}`, size && `np-text--${size}`, maxLines && "np-text--clamp", className)} />;
}

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  type?: "display-1";
};

export function Heading({ level, type, className, ...props }: HeadingProps) {
  const Component = `h${level}` as const;
  return <Component {...props} className={cn("np-heading", `np-heading--${level}`, type && "np-heading--display", className)} />;
}

const Plunk = styled.span`
  display: inline-flex;
  position: relative;
  isolation: isolate;
  max-width: 100%;

  &::before,
  &::after {
    background: var(--np-edge, #806623);
    content: "";
    pointer-events: none;
    position: absolute;
    transition: transform 120ms ease-in-out, opacity 120ms ease-in-out;
    z-index: -1;
  }

  &::before {
    bottom: 0;
    height: 3px;
    left: 0;
    transform: skewX(45deg);
    transform-origin: 0 0;
    width: calc(100% - 3px);
  }

  &::after {
    height: calc(100% - 3px);
    right: 0;
    top: 0;
    transform: skewY(45deg);
    transform-origin: 0 0;
    width: 3px;
  }

  &:active > .np-button__face,
  &[data-active="true"] > .np-button__face {
    transform: translate3d(3px, 3px, 0);
  }
`;

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "lg";
  href?: string;
  as?: React.ElementType;
  isDisabled?: boolean;
  isLoading?: boolean;
  clickAction?: () => void;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ label, icon, variant = "secondary", size, href, as: _as, isDisabled, disabled, isLoading, clickAction, onClick, className, type = "button", ...props }, ref) {
  const content = <>{isLoading ? <LoaderCircle className="np-spin size-4" aria-hidden /> : icon}<span>{label}</span></>;
  const faceClass = cn("np-button__face", `np-button__face--${variant}`, size && `np-button__face--${size}`, className);

  if (href) {
    return <Plunk className={cn("np-button", isDisabled && "np-button--disabled")}><Link href={href} aria-disabled={isDisabled} className={faceClass}>{content}</Link></Plunk>;
  }

  return <Plunk className={cn("np-button", (isDisabled || disabled) && "np-button--disabled")}>
    <button ref={ref} type={type} disabled={isDisabled || disabled || isLoading} onClick={(event) => { onClick?.(event); clickAction?.(); }} className={faceClass} {...props}>{content}</button>
  </Plunk>;
});

type IconButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  icon: React.ReactNode;
  variant?: "ghost" | "secondary";
  isDisabled?: boolean;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({ label, icon, variant = "ghost", isDisabled, className, ...props }, ref) {
  return <button ref={ref} type="button" aria-label={label} title={label} disabled={isDisabled} className={cn("np-icon-button", `np-icon-button--${variant}`, className)} {...props}>{icon}</button>;
});

type FieldStatus = { type: "error"; message: string };
type TextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "width"> & {
  label: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  hasAutoFocus?: boolean;
  hasClear?: boolean;
  isLabelHidden?: boolean;
  isRequired?: boolean;
  startIcon?: React.ReactNode;
  status?: FieldStatus;
  width?: Measure;
};

export function TextInput({ label, onChange, onEnter, hasAutoFocus, hasClear, isLabelHidden, isRequired, startIcon, status, width, value, className, ...props }: TextInputProps) {
  const id = React.useId();
  return <label className={cn("np-field", className)} style={{ width: measure(width) }}>
    <span className={cn("np-field__label", isLabelHidden && "sr-only")}>{label}{isRequired ? " *" : ""}</span>
    <span className="np-field__control">{startIcon}<input id={id} value={value} data-autofocus={hasAutoFocus || undefined} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") onEnter?.(); }} aria-invalid={status?.type === "error"} {...props} />{hasClear && value ? <button type="button" aria-label={`Clear ${label}`} onClick={() => onChange("")}><X className="size-4" /></button> : null}</span>
    {status ? <span className="np-field__error" role="alert">{status.message}</span> : null}
  </label>;
}

type TextAreaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> & { label: string; onChange: (value: string) => void };
export function TextArea({ label, onChange, value, className, ...props }: TextAreaProps) {
  return <label className={cn("np-field", className)}><span className="np-field__label">{label}</span><span className="np-field__control"><textarea value={value} onChange={(event) => onChange(event.target.value)} {...props} /></span></label>;
}

type SelectorProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & { label: string; options: Array<{ label: string; value: string }>; onChange: (value: string) => void; isDisabled?: boolean };
export function Selector({ label, options, onChange, isDisabled, value, ...props }: SelectorProps) {
  return <label className="np-field"><span className="np-field__label">{label}</span><span className="np-field__control np-field__select"><select value={value} disabled={isDisabled} onChange={(event) => onChange(event.target.value)} {...props}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></span></label>;
}

type DialogProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  width?: Measure;
  maxHeight?: Measure;
  padding?: number;
  purpose?: "form";
  position?: React.CSSProperties & { end?: string };
  "aria-label"?: string;
};

export function Dialog({ children, isOpen, onOpenChange, width = 520, maxHeight = "92dvh", padding, position, "aria-label": ariaLabel }: DialogProps) {
  const { end, ...restPosition } = position ?? {};
  const isDocked = end !== undefined;
  return <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="np-dialog__overlay" />
      <DialogPrimitive.Content aria-label={ariaLabel} className={cn("np-dialog__content", isDocked && "np-dialog__content--docked")} style={{ width: measure(width), maxHeight: measure(maxHeight), padding: padding === undefined ? undefined : `${padding * 4}px`, right: end, ...restPosition }}>{children}</DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>;
}

export function DialogHeader({ title, subtitle, onOpenChange, hasDivider }: { title: string; subtitle?: string; onOpenChange: (open: boolean) => void; hasDivider?: boolean }) {
  return <HStack justify="between" align="start" gap={4} padding={5} className={cn(hasDivider && "np-divider--bottom")}><VStack gap={1}><Heading level={2}>{title}</Heading>{subtitle ? <Text color="secondary">{subtitle}</Text> : null}</VStack><IconButton label="Close" icon={<X className="size-5" />} onClick={() => onOpenChange(false)} /></HStack>;
}

export function Token({ label, color = "yellow", size }: { label: string; color?: string; size?: "sm" }) {
  return <span className={cn("np-token", `np-token--${color}`, size === "sm" && "np-token--sm")}>{label}</span>;
}

export function Badge({ label, variant = "neutral", icon }: { label: string; variant?: "success" | "neutral"; icon?: React.ReactNode }) {
  return <span className={cn("np-badge", `np-badge--${variant}`)}>{icon}{label}</span>;
}

export function StatusDot({ variant = "neutral", label, isPulsing }: { variant?: "success" | "warning" | "neutral"; label: string; isPulsing?: boolean }) {
  return <span className={cn("np-status", `np-status--${variant}`, isPulsing && "np-status--pulsing")} role="img" aria-label={label} />;
}

export function Avatar({ src, name = "", size = 40, shape }: { src?: string | null; name?: string | null; size?: number; shape?: "rounded" }) {
  const initials = name?.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?";
  return <span className={cn("np-avatar", shape === "rounded" && "np-avatar--rounded")} style={{ width: size, height: size }}>{src ? <Image src={src} alt={name ?? ""} width={size} height={size} /> : initials}</span>;
}

export function Skeleton({ width, height, radius, index }: { width: Measure; height: Measure; radius?: number; index?: number }) {
  return <span className="np-skeleton" style={{ width: measure(width), height: measure(height), borderRadius: radius ? `${radius * 4}px` : undefined, animationDelay: index ? `${index * 80}ms` : undefined }} />;
}

export function Grid({ columns, ...props }: CommonProps & { columns?: { minWidth: number; max: number; repeat: "fit" } }) {
  return <Section {...props} className={cn("np-grid", props.className)} style={{ ...props.style, gridTemplateColumns: columns ? `repeat(auto-fit, minmax(min(100%, ${columns.minWidth}px), 1fr))` : undefined }} />;
}

export function SelectableCard({ label, isSelected, onChange, children, className }: { label: string; isSelected: boolean; onChange: () => void; children: React.ReactNode; padding?: number; className?: string }) {
  return <button type="button" aria-label={label} aria-pressed={isSelected} onClick={onChange} className={cn("np-selectable", isSelected && "np-selectable--selected", className)}>{children}</button>;
}

export function Layout({ header, content, footer, className }: { header?: React.ReactNode; content?: React.ReactNode; footer?: React.ReactNode; height?: Measure; className?: string }) {
  return <div className={cn("np-layout", className)}>{header}<div className="np-layout__body">{content}</div>{footer}</div>;
}

export function LayoutContent({ isScrollable, ...props }: CommonProps & { isScrollable?: boolean }) {
  return <Section {...props} className={cn(isScrollable && "np-scroll", props.className)} />;
}

export function LayoutFooter({ hasDivider, ...props }: CommonProps & { hasDivider?: boolean }) {
  return <Section {...props} className={cn(hasDivider && "np-divider--top", props.className)} />;
}

export function TopNav({ heading, startContent, endContent, className }: { heading?: React.ReactNode; startContent?: React.ReactNode; endContent?: React.ReactNode; label?: string; className?: string }) {
  return <header className={cn("np-topnav", className)}>{heading ?? startContent}<div className="np-topnav__end">{endContent}</div></header>;
}

export function SideNav({ header, topContent, footer, children, className }: { header?: React.ReactNode; topContent?: React.ReactNode; footer?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return <aside className={cn("np-sidenav", className)}>{header}{topContent}<nav className="np-sidenav__nav">{children}</nav>{footer ? <div className="np-sidenav__footer">{footer}</div> : null}</aside>;
}

export function SideNavHeading({ heading, subheading, headingHref, icon }: { heading: string; subheading?: string; headingHref: string; as?: React.ElementType; icon?: React.ReactNode }) {
  return <Link href={headingHref} className="np-sidenav__brand">{icon}<span><strong>{heading}</strong>{subheading ? <small>{subheading}</small> : null}</span></Link>;
}

export function SideNavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="np-sidenav__section"><span className="np-sidenav__label">{title}</span>{children}</section>;
}

export function SideNavItem({ label, href, icon, isSelected }: { label: string; href: string; as?: React.ElementType; icon?: React.ReactNode; isSelected?: boolean }) {
  return <Link href={href} aria-current={isSelected ? "page" : undefined} className={cn("np-sidenav__item", isSelected && "np-sidenav__item--selected")}>{icon}<span>{label}</span></Link>;
}

export function AppShell({ topNav, sideNav, children, className, height }: { topNav?: React.ReactNode; sideNav?: React.ReactNode; children: React.ReactNode; className?: string; height?: "fill" | "auto"; variant?: "surface"; mobileNav?: { breakpoint: "md" } }) {
  return <div className={cn("np-app-shell", !sideNav && "np-app-shell--no-side", height === "fill" && "np-app-shell--fill", className)}>{sideNav}{topNav ? <div className="np-app-shell__top">{topNav}</div> : null}<main className="np-app-shell__main">{children}</main></div>;
}
