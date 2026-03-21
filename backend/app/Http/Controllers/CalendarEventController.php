<?php

namespace App\Http\Controllers;

use App\Models\CalendarEvent;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;\nclass CalendarEventController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 20);
        $syncService = $request->get('sync_service');

        $query = $user->calendarEvents();

        if ($syncService) {
            $query->where('sync_service', $syncService);
        }

        $events = $query->latest()->paginate($limit);

        return response()->json($events);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validation = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date_format:Y-m-d H:i:s',
            'end_time' => 'required|date_format:Y-m-d H:i:s|after:start_time',
            'sync_service' => 'required|in:google_calendar,apple_calendar,outlook,local',
            'external_event_id' => 'nullable|string',
            'is_synced' => 'sometimes|boolean',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $event = $user->calendarEvents()->create($validated);

        return response()->json([
            'message' => 'Calendar event created successfully',
            'data' => $event,
        ], 201);
    }

    public function show($id, Request $request)
    {
        $user = $request->user();

        $event = $user->calendarEvents()->findOrFail($id);

        return response()->json($event);
    }

    public function update($id, Request $request)
    {
        $user = $request->user();

        $event = $user->calendarEvents()->findOrFail($id);

        $validation = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'start_time' => 'sometimes|date_format:Y-m-d H:i:s',
            'end_time' => 'sometimes|date_format:Y-m-d H:i:s',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $event->update($validated);

        return response()->json([
            'message' => 'Calendar event updated successfully',
            'data' => $event,
        ]);
    }

    public function destroy($id, Request $request)
    {
        $user = $request->user();

        $event = $user->calendarEvents()->findOrFail($id);

        $event->delete();

        return response()->json([
            'message' => 'Calendar event deleted successfully',
        ]);
    }

    public function getEventsByDate($date, Request $request)
    {
        $user = $request->user();

        $events = $user->calendarEvents()
            ->whereDate('start_time', $date)
            ->orderBy('start_time')
            ->get();

        return response()->json($events);
    }

    public function getEventsByDateRange(Request $request)
    {
        $user = $request->user();

        $validation = Validator::make($request->all(), [
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after:start_date',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        $events = $user->calendarEvents()
            ->whereBetween('start_time', [
                $validated['start_date'] . ' 00:00:00',
                $validated['end_date'] . ' 23:59:59',
            ])
            ->orderBy('start_time')
            ->get();

        return response()->json($events);
    }

    public function syncWithGoogle(Request $request)
    {
        $user = $request->user();

        $validation = Validator::make($request->all(), [
            'access_token' => 'required|string',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        // TODO: Implement Google Calendar API sync
        // This would involve:
        // 1. Connecting to Google Calendar API
        // 2. Fetching events from user's Google Calendar
        // 3. Creating/updating CalendarEvent records with sync_service = 'google_calendar'

        return response()->json([
            'message' => 'Google Calendar sync initiated',
            'status' => 'pending',
        ]);
    }

    public function syncWithApple(Request $request)
    {
        $user = $request->user();

        // TODO: Implement Apple Calendar sync

        return response()->json([
            'message' => 'Apple Calendar sync initiated',
            'status' => 'pending',
        ]);
    }

    public function syncWithOutlook(Request $request)
    {
        $user = $request->user();

        $validation = Validator::make($request->all(), [
            'access_token' => 'required|string',
        ]);
        if ($validation->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validation->errors(),
            ], 422);
        }
        $validated = $validation->validated();

        // TODO: Implement Outlook Calendar sync

        return response()->json([
            'message' => 'Outlook Calendar sync initiated',
            'status' => 'pending',
        ]);
    }

    public function getTodayEvents(Request $request)
    {
        $user = $request->user();

        $events = $user->calendarEvents()
            ->whereDate('start_time', now()->toDateString())
            ->orderBy('start_time')
            ->get();

        return response()->json($events);
    }

    public function getUpcomingEvents(Request $request)
    {
        $user = $request->user();
        $days = $request->get('days', 7);

        $endDate = now()->addDays($days);

        $events = $user->calendarEvents()
            ->where('start_time', '>=', now())
            ->where('start_time', '<=', $endDate)
            ->orderBy('start_time')
            ->get();

        return response()->json($events);
    }

    public function getSyncServiceStats(Request $request)
    {
        $user = $request->user();

        $stats = [];
        $services = ['google_calendar', 'apple_calendar', 'outlook', 'local'];

        foreach ($services as $service) {
            $stats[$service] = $user->calendarEvents()
                ->where('sync_service', $service)
                ->count();
        }

        return response()->json([
            'total_events' => $user->calendarEvents()->count(),
            'by_service' => $stats,
        ]);
    }
}
