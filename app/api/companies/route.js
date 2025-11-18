import connectToDatabase from '@/lib/mongodb';
import Company from '@/models/Company';

export const dynamic = 'force-dynamic'; 

export async function GET(request) {
  try {
    // Only this line → connects once per request (cached globally)
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const industry = searchParams.get('industry') || '';
    const location = searchParams.get('location') || '';
    const size = searchParams.get('size') || '';
    const type = searchParams.get('type') || '';
    const sort = searchParams.get('sort') || 'name';

    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (industry) query.industry = industry;
    if (location) query.location = location;
    if (size) query.size = size;
    if (type) query.type = type;

    const total = await Company.countDocuments(query);

    const companies = await Company.find(query)
      .sort({ [sort]: sort === 'name' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return Response.json({
      companies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('API Error:', error.message);
    return Response.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase(); // ← Reuse the same connection

    const body = await request.json();
    const company = await Company.create(body);

    return Response.json(company, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error.message);
    return Response.json({ error: error.message || 'Failed to add company' }, { status: 400 });
  }
}