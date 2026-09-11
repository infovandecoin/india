import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vandecoin_flutter/core/widgets/chakra_spinner.dart';

void main() {
  testWidgets('ChakraSpinner renders properly', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ChakraSpinner(size: 60),
        ),
      ),
    );

    expect(find.byType(ChakraSpinner), findsOneWidget);
    expect(find.byType(CustomPaint), findsWidgets);
  });
}
