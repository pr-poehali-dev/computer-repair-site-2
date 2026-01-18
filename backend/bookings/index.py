import json
import os
from datetime import datetime, date
import psycopg2
from psycopg2.extras import RealDictCursor

def serialize_dates(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    return obj

def handler(event: dict, context) -> dict:
    """API для управления записями на ремонт техники"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            
            if method == 'GET':
                query_params = event.get('queryStringParameters') or {}
                status_filter = query_params.get('status')
                
                if status_filter:
                    cur.execute(
                        f"SELECT * FROM {schema}.bookings WHERE status = %s ORDER BY booking_date DESC, booking_time DESC",
                        (status_filter,)
                    )
                else:
                    cur.execute(f"SELECT * FROM {schema}.bookings ORDER BY booking_date DESC, booking_time DESC")
                
                bookings = cur.fetchall()
                
                bookings_list = []
                for booking in bookings:
                    booking_dict = dict(booking)
                    for key, value in booking_dict.items():
                        booking_dict[key] = serialize_dates(value)
                    bookings_list.append(booking_dict)
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'bookings': bookings_list}),
                    'isBase64Encoded': False
                }
            
            elif method == 'POST':
                body = json.loads(event.get('body', '{}'))
                
                cur.execute(
                    f"""INSERT INTO {schema}.bookings 
                       (client_name, client_phone, client_email, booking_date, booking_time, service_type, notes)
                       VALUES (%s, %s, %s, %s, %s, %s, %s)
                       RETURNING id, client_name, booking_date, booking_time""",
                    (
                        body.get('client_name'),
                        body.get('client_phone'),
                        body.get('client_email'),
                        body.get('booking_date'),
                        body.get('booking_time'),
                        body.get('service_type'),
                        body.get('notes')
                    )
                )
                
                result = cur.fetchone()
                conn.commit()
                
                result_dict = dict(result)
                for key, value in result_dict.items():
                    result_dict[key] = serialize_dates(value)
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'booking': result_dict
                    }),
                    'isBase64Encoded': False
                }
            
            elif method == 'PUT':
                body = json.loads(event.get('body', '{}'))
                booking_id = body.get('id')
                
                if not booking_id:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Booking ID required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    f"""UPDATE {schema}.bookings 
                       SET status = %s, notes = %s, updated_at = CURRENT_TIMESTAMP
                       WHERE id = %s
                       RETURNING id, status""",
                    (body.get('status'), body.get('notes'), booking_id)
                )
                
                result = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'booking': dict(result) if result else None
                    }),
                    'isBase64Encoded': False
                }
            
            elif method == 'DELETE':
                query_params = event.get('queryStringParameters') or {}
                booking_id = query_params.get('id')
                
                if not booking_id:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Booking ID required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(f"DELETE FROM {schema}.bookings WHERE id = %s", (booking_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        conn.close()
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }