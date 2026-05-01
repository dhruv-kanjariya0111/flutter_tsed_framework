import 'package:mocktail/mocktail.dart';
import 'package:frontend/src/features/auth/domain/repositories/auth_repository.dart';
import 'package:frontend/src/core/network/dio_client.dart';
import 'package:dio/dio.dart';

class MockAuthRepository extends Mock implements AuthRepository {}
class MockDio extends Mock implements Dio {}
