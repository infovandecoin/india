import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vandecoin_flutter/core/widgets/compliance_banner.dart';

void main() {
  testWidgets('ComplianceBanner renders mandatory simulated reward disclaimer', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ComplianceBanner(),
        ),
      ),
    );

    expect(find.text('Regulatory & Concept Notice'), findsOneWidget);
    expect(
      find.textContaining('VDC represents simulated in-app participation rewards'),
      findsOneWidget,
    );
  });
}
