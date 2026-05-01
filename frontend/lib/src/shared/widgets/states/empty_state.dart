import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';

/// SPEC-004: Always actionable empty state with CTA.
class EmptyStateWidget extends StatelessWidget {
  const EmptyStateWidget({
    super.key,
    required this.title,
    required this.subtitle,
    required this.ctaLabel,
    required this.onCta,
    this.icon,
  });

  final String title;
  final String subtitle;
  final String ctaLabel;
  final VoidCallback onCta;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      identifier: 'empty_state',
      label: '$title. $subtitle',
      child: Center(
        child: Padding(
          padding: EdgeInsets.all(context.spacing.s24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null)
                Icon(icon, size: 64, color: context.colors.textTertiary),
              SizedBox(height: context.spacing.s16),
              Text(
                title,
                style: Theme.of(context).textTheme.titleLarge,
                textAlign: TextAlign.center,
              ),
              SizedBox(height: context.spacing.s8),
              Text(
                subtitle,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: context.colors.textSecondary,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: context.spacing.s24),
              Semantics(
                identifier: 'empty_state_cta_button',
                label: ctaLabel,
                button: true,
                child: ElevatedButton(
                  onPressed: onCta,
                  child: Text(ctaLabel),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
