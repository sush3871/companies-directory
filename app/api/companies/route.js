import clientPromise from '@/lib/mongodb';
import mongoose from 'mongoose';
import Company from '@/models/Company';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const industry = searchParams.get('industry') || '';
    const location = searchParams.get('location') || '';
    const size = searchParams.get('size') || '';
    const type = searchParams.get('type') || '';
    const sort = searchParams.get('sort') || 'name';

    await clientPromise;
    await mongoose.connect(process.env.MONGODB_URI);

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
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await clientPromise;
    await mongoose.connect(process.env.MONGODB_URI);

    const company = await Company.create(body);
    return Response.json(company, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}